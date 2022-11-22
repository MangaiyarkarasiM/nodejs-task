const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const { UserDetails } = require("./model/user");

const createJWT = async (payload) => {
  var token = jwt.sign(payload, secret, {
    expiresIn: "10m",
  });
  return token;
};

const authVerify = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new Error("Token can't be null");
    let payload = jwt.verify(token, secret);
    const user = await UserDetails.findOne({ email: payload.email });
    if (!user) throw new Error("Invalid token");
    next();
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 401,
      message: "Please authenticate",
    });
  }
};

const hashing = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (error) {
    return error;
  }
};

const hashCompare = async (value, hash) => {
  try {
    return await bcrypt.compare(value, hash);
  } catch (error) {
    return error;
  }
};

module.exports = { hashing, hashCompare, createJWT, authVerify };
