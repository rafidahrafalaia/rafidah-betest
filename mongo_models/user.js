const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    Id: {
      type: String,
      required: true, 
      index: { unique: true }
    },
    userName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true, 
      index: true
    },
    identityNumber: {
      type: String,
      required: true, 
      index: true
    },
  },
  { collection: "user" }
);

userSchema.index(
  {"Id": 1},
  {"accountNumber": 1},
  {"identityNumber": 1},
);

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
