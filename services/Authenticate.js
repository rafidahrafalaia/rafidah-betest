let uuid = require('uuid');
uuid = uuid.v1;
const jwt = require('jsonwebtoken');
const clientIP = require('request-ip');
const models = require("../models");
const Sequelize = models.Sequelize;
const sequelize = models.sequelize;
const Op = Sequelize.Op;

// UTILS
const config = require('../config');
const logger = require('../loaders/logger');
const { mysqlDate } = require('../utils');

module.exports = class Authenticate {
	// GENERATE A TOKEN
	static async GenerateToken(client, req, generateSession) {
		generateSession =
			typeof generateSession != 'undefined' ? (generateSession != true ? false : true) : true;
		try {
			let updatedClient = await this.updateLoginHistory({
				client: client,
				ip_address: clientIP.getClientIp(req),
				last_login: mysqlDate(),
			});

			if(!updatedClient){
				return false;
			}

			const { id, name, email, ip } = updatedClient;

			const jwtclaims = {
				id,
				name,
				email,
				ip,
				token: 'access',
				expire: config.jwt.expire,
			};

			const access_token = jwt.sign(JSON.stringify(jwtclaims), config.jwt.secret);

			return { access_token, client: updatedClient };
		} catch (e) {
			logger.error('🔥 error: %o', e);
			return false;
		}
	}
	
	static async validSession(token){
		try{
			const decoded = jwt.verify(token, config.jwt.secret, (err, result) => { 
				if(err)
					return false; 
				return result;
			});
			
			const checkSession = await models.user_active_sessions.findOne({
				where: { user_id: decoded.id, access_token: token },
			});
			if (!checkSession || !decoded) {
				return false;
			}
			return true;
		}catch(e){
			logger.error('🔥 error: %o', e);
			return false;
		}
	}

	// UPDATE USER HISTORY LOGIN
	static async updateLoginHistory({ client, ip_address, last_login }) {
		let values, transaction, clauses;

		transaction = await sequelize.transaction();
		clauses = { ...clauses, where: { email:client.email, password:client.password }, transaction };

		// USER
		values = { ...values, ip_address, last_login };

		try {
			await models.users.update(values, clauses);

			await transaction.commit();

			const result = await models.users.findOne({
				where: { email: client.email, password: client.password },
				attributes: [
					'id',
					'name',
					'email',
					['ip_address', 'ip'],
					'date_created',
				],
			});
			if (!result) {
				return false;
			}
			return result.toJSON();
		} catch (err) {
			await transaction.rollback();
			logger.error(err);
			throw new Error(
				'Failed to update user login history record, check submited value [DB Error]',
			);
		}
	}
};
