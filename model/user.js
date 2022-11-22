const mongoose = require("mongoose");
const validator = require("validator");

var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    occupation: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    writeConcern: {
      j: true,
      wtimeout: 2000,
    },
  }
);
const UserDetails = mongoose.model("users", userSchema);

module.exports = { UserDetails };
