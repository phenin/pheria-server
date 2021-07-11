const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'skdjfwhfcn,jhckjwhfmn.5723rjnF$R:>:"LO@#423iujfas';

const verifyToken = async (token) => {
    let decoded
    try {
      decoded = await jwt.verify(token, jwtSecretKey);
    } catch(err) {
      return err
    }

    return decoded;
};

const signToken = async (data) => {
  let accessToken, refreshToken
  try {
    accessToken = await jwt.sign({
      data
    }, jwtSecretKey, { expiresIn: 24 * 60 * 60 });
    refreshToken = await jwt.sign({
      data
    }, jwtSecretKey);
  } catch(err) {
    return err
  }
  return {accessToken, refreshToken};
};

const decodeToken = async (token) => {
  let decoded
  try {
    decoded = await jwt.decode(token);
  } catch(err) {
    return err
  }

  return decoded;
};

module.exports = {
  verifyToken,
  decodeToken,
  signToken
};
