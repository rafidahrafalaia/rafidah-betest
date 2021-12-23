const { UserModel } = require('../mongo_models/user.js');
const config = require('../config');

module.exports = class User {
	// FIND USER
	static async findBy({accountNumber, identityNumber, Id}) {
		let query={};

		if(accountNumber){
			query = { accountNumber };
		}else if(identityNumber){
			query = { identityNumber };
		}else if(Id){
			query = { Id };
		}
		return new Promise((resolve, reject) => {
			UserModel.find(query)
			.then(data => {
				if(data.length>=1){
					resolve ({status: 200, result: data});
				}else{
					resolve ({status: 404, result: "User was not found!"});
				}
			})
			.catch(err => {
				resolve ({status: 500, result: err});
			});
		});
	}

	static async findAll(page){
		const limits = config.display.limits;
		return new Promise((resolve, reject) => {
			UserModel.find({})
			.limit(limits)
			.skip(limits * page)
			.sort({
				Id: 'asc'
			})
			.lean()
			.exec(
				function (err, data) {
				if(err) resolve({status: 500, result: err});
				resolve({status: 200, result: data});
			}
			);
		  });
	}
    // Create a User
	static async createOne(values) {
		return new Promise((resolve, reject) => {
			const newUser = new UserModel(values);
			// Save User in the database
			newUser
			.save()
			.then(data => {
				resolve ({status: 200, result: data});
			})
			.catch(err => {
				resolve ({status: 500, result: err});
			});
		  });
	}

    // Update a User
	static async updateOne(values) {
		return new Promise((resolve, reject) => { 
			UserModel.updateOne({Id:values.Id}, values)
			.then(data => {
			if (data.matchedCount<1) {
				resolve ({status: 404, result: "Cannot update User with Id=" + values.Id + ". User was not found!"});
			} 
			resolve ({status: 200, result: values});
			})
			.catch(err => {
				console.log(err);
				resolve ({status: 500, result: err});
			});
		  });
	}

    // Delete a User
	static async deleteOne(Id) {
		return new Promise((resolve, reject) => { 
			UserModel.deleteOne({Id}, { useFindAndModify: false })
			.then(data => {
			if (!data.deletedCount) {
				resolve ({status: 404, result: "Cannot delete User with Id=" + Id + ". User was not found!"});
			} else {
				resolve ({status: 200, result: "User was deleted successfully!"});
			}
			})
			.catch(err => {
				resolve ({status: 500, result: err});
			});
		});
	}
};
