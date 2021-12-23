const { Router } = require("express");

// ROUTES
const authenticate = require("./authenticate");
const user = require("./user");

module.exports = () => {
  const app = Router();

  authenticate(app);
  user(app);

  return app;
};