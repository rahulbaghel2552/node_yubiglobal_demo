const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var User = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  }, 
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

User.methods.generateAuthToken = async function () {
  const token_val = jwt.sign(
    { _id: this._id.toString() },
    "asdfghjasdfghjsdfghjsdfgdfgbdfrgfg"
  );
  this.tokens = this.tokens.concat({ token: token_val });
  await this.save();
  return this.tokens;
};

//converting password into hash
User.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Register = new mongoose.model("Register", User);

module.exports = Register;
