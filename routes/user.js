// GENERALS
const route = require("express").Router();
const user = require("../controllers/user.js");
const auth = require("../controllers/authenticate.js");

module.exports = (app) => {
	app.use("/user", route);
  
	route.post("/", auth.isLogin, user.postUser);
	route.get("/", auth.isLogin, user.findUser);
	route.put("/", auth.isLogin, user.putUser);
	route.delete("/", auth.isLogin, user.deleteUser);
	route.get("/all", auth.isLogin, user.findAllUser);
};