const config = require("../config");
const { uuid } = require('uuidv4');
const logger = require("../loaders/logger");
const { query, body, validationResult, param } = require("express-validator");
const User = require("../services/User");
const Redis = require("../services/Redis");

const customValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      param: error.param,
      value: error.value,
      location: error.location,
      message: error.msg,
    };
  },
});

 // Create and Save a new User
 exports.postUser = async (req, res) => {
  await body("userName").not().isEmpty().withMessage("userName can not be empty!").isString().withMessage('Incorrect username format').run(req);
  await body("accountNumber").not().isEmpty().withMessage("accountNumber can not be empty!").run(req);
  await body("emailAddress").not().isEmpty().trim().withMessage('emailAddress can not be empty!').isEmail().withMessage('Incorrect email format').run(req);
  await body("identityNumber").not().isEmpty().withMessage("identityNumber can not be empty!").run(req);

  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {userName, accountNumber, emailAddress, identityNumber} = req.body;
  try{
    const values = { 
      Id : uuid(), 
      userName,
      accountNumber, 
      emailAddress, 
      identityNumber
    };
    // Create a User
    const created = await User.createOne(values);
    if(created.status==200){
      await Redis.setBy({
        Id: values.Id, 
        accountNumber: values.accountNumber,
        identityNumber: values.identityNumber,
        data: created.result
      });
      await Redis.delAll();
    }
    // await
    res.status(created.status).json(created.result);
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
};

// Update a User by the id in the request
exports.putUser = async (req, res) => { 
  await body('Id').not().isEmpty().withMessage("Id can not be empty!").isUUID().withMessage('Incorrect Id format').run(req);
  await body('userName').not().isEmpty().withMessage("userName can not be empty!").isString().withMessage('Incorrect username format').run(req);
  await body('accountNumber').not().isEmpty().withMessage("accountNumber can not be empty!").run(req);
  await body('emailAddress').not().isEmpty().trim().withMessage('emailAddress can not be empty!').isEmail().withMessage('Incorrect email format').run(req);
  await body('identityNumber').not().isEmpty().withMessage("identityNumber can not be empty!").run(req);

  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try{
    const updated = await User.updateOne(req.body);
    if(updated.status==200){
      await Redis.setBy({
        Id: req.body.Id, 
        accountNumber: req.body.accountNumber,
        identityNumber: req.body.identityNumber,
        data: updated.result
      });
      await Redis.delAll();
    }
    res.status(updated.status).json(updated.result);
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
};


// Delete a User with the specified id in the request
exports.deleteUser = async (req, res) => {
  await body("Id").not().isEmpty().withMessage("Must provide an Id").isUUID().withMessage("Incorrect Id format").run(req);

  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  const Id = req.body.Id;
  try{
    const find = await User.findBy({Id});
    const deleted = await User.deleteOne(Id);
    if(deleted.status==200){
      await Redis.delBy(Id, find.result[0].accountNumber, find.result[0].identityNumber);
      await Redis.delAll();
    }
    res.status(deleted.status).json(deleted.result);
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
}

// Find a User
exports.findUser = async (req, res) => {
  const {accountNumber, identityNumber} = req.query;
  try{
    if((!accountNumber && !identityNumber) || (accountNumber && identityNumber)){
     res.status(400).send({
       message: "Need only one of the accountNumber & IdentityNumber!"
     });
    }
    // Find a User 
    const redis = await Redis.findBy({accountNumber, identityNumber});
    if(redis){
      res.status(redis.status).json(redis.result);
    }
    const findOne = await User.findBy({accountNumber, identityNumber});
    if(findOne.status==200){
      await Redis.setBy({accountNumber, identityNumber, data: findOne.result});
    }
    if(!redis){
      res.status(findOne.status).json(findOne.result);
    }
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
 };

// // Retrieve all Package from the database.
exports.findAllUser = async (req, res) => {
  await query("page")
    .optional()
    .not()
    .matches(/[!@#\$%\^\&*\)\(+=]+/, "g")
    .withMessage("Must not contain special character")
    .run(req);
  
  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try{
    const page = req.query.page ? req.query.page-1 : 0;
    const redis = await Redis.findAll(page);
    if(redis){
      res.status(redis.status).json(redis.result);
    }
    const fidAll = await User.findAll(page);
    if(fidAll.status==200){
      await Redis.setAll(page, fidAll.result);
    }
    if(!redis){
      res.status(fidAll.status).json(fidAll.result);
    }
    }catch (err) {
      logger.error("🔥 error: %o", err);
      throw new Error(err);
  }
}