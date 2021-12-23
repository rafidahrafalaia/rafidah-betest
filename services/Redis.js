const config = require('../config');
const redisClient = require('../loaders/redis')
const RedisIO = require('ioredis');
const redis = new RedisIO(config.redisDB);

module.exports = class Redis {
	static async findBy({Id, accountNumber, identityNumber}) {
		if(accountNumber){
			let setKey = `accountNumber-${accountNumber}`;
			let result = await redisClient().get(setKey);
			if (result || result != null) {
				return ({status: 200, result: JSON.parse(result)});
			}
			return false;
		}else if(identityNumber){
			let setKey = `identityNumber-${identityNumber}`;
			let result = await redisClient().get(setKey);
			if (result || result != null) {
				return ({status: 200, result: JSON.parse(result)});
			}
			return false;
		}else if(Id){
			let setKey = `Id-${Id}`;
			let result = await redisClient().get(setKey);
			if (result || result != null) {
				return ({status: 200, result: JSON.parse(result)});
			}
			return false;
		}
	}

	static async setBy({Id, accountNumber, identityNumber, data}){
		let setKeyAccount = `accountNumber-${accountNumber}`;
		let setKeyIdentity = `identityNumber-${identityNumber}`;
		let setKeyId = `Id-${Id}`;
		await redisClient().set(setKeyAccount, JSON.stringify(data));
		await redisClient().set(setKeyIdentity, JSON.stringify(data));
		await redisClient().set(setKeyId, JSON.stringify(data));
		return true;
	}
	
	static async delBy(Id, accountNumber, identityNumber){
		let setKeyAccount = `accountNumber-${accountNumber}`;
		let setKeyIdentity = `identityNumber-${identityNumber}`;
		let setKeyId = `Id-${Id}`;

		redisClient().del(setKeyAccount,setKeyIdentity,setKeyId);
		return true;
	}

	static async findAll(page) {
		let setKey = `all-${page}`;
		let result = await redisClient().get(setKey);
		if (result || result != null) {
			return ({status: 200, result: JSON.parse(result)});
		}
		return false;
	}

	static async setAll(page, data) {
		let setKey = `all-${page}`;
		await redisClient().set(setKey, JSON.stringify(data));
		return false;
	}

	static async delAll(){
		const stream = redis.scanStream({ match: 'all-*',count: 100 });
		const pipeline = redis.pipeline()
		const localKeys = [];
		stream.on('data', function (resultKeys) {
		for (var i = 0; i < resultKeys.length; i++) {
			localKeys.push(resultKeys[i]);
			pipeline.del(resultKeys[i]);
		}
		if(localKeys.length > 100){
			pipeline.exec(()=>{});
			localKeys=[];
			pipeline = redis.pipeline();
		}
		});
		stream.on('end', function(){
		pipeline.exec(()=>{});
		});
		return true;
	}
};
