var { dbUrl } = require("../dbConfig");
const mongoose = require("mongoose");
const { UserDetails } = require("../model/user");
const { hashing, hashCompare, createJWT } = require("../auth");

mongoose.connect(dbUrl);

//To get all users
exports.getAllUsers = async (req, res) => {
  try {
    const details = await UserDetails.find();
    res.send({
      statusCode: 200,
      users: details,
    });
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//To get a user with user ID
exports.getUserWithID = async (req, res) => {
  try {
    const details = await UserDetails.findOne({ _id: req.params.id });
    res.send({
      statusCode: 200,
      user: details,
    });
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//To create/register a user
exports.createUser = async (req, res) => {
  try {
    //
    const details = await UserDetails.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (details) {
      res.send({
        statusCode: 400,
        message: "User already exists",
      });
    } else {
      //hashing the password and saving it in the db
      let hashedPassword = await hashing(req.body.password);
      req.body.password = hashedPassword;
      let detail = await UserDetails.create(req.body);
      res.send({
        statusCode: 200,
        detail,
        message: "Created user successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//To login the user
exports.loginUser = async (req, res) => {
  try {
    const details = await UserDetails.findOne({ email: req.body.email });
    if (!details) {
      res.send({
        statusCode: 400,
        message: "User Not found",
      });
    } else {
      //Compare the password entered by user and stored in the DB
      let compare = await hashCompare(req.body.password, details.password);
      if (compare == true) {
        //if password provided by the user is correct jwt token will be created and sent in the login successful response
        const token = await createJWT({ email: req.body.email });
        res.send({
          statusCode: 200,
          token,
          message: "Login Successfull",
        });
      } else {
        res.send({
          statusCode: 401,
          message: "Invalid Password",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal Server error",
    });
  }
};

//To update the user with user ID
exports.updateUserWithID = async (req, res) => {
  try {
    const details = await UserDetails.updateOne(
      { _id: req.params.id },
      req.body
    );
    res.send({
      statusCode: 200,
      details,
      message: "User details updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//To delete the user with user ID
exports.deleteUserWithID = async (req, res) => {
  try {
    await UserDetails.deleteOne({ _id: req.params.id });
    res.send({
      statusCode: 200,
      message: "Deleted the user successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};
