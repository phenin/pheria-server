const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");
const {
  decodeToken,
  signToken 
} = require("../middleware/jwt-service");
const bcrypt = require("bcryptjs")
const userModel = require('../model/user-model');

const {ObjectId} = require('mongodb')

const createUser = async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body || {};
  if ( !name || !email || !password) {
		return responseBadRequest(res);
  }

  let user 
  try {
    user = await userModel.getUserByEmail(email);
  } catch (e) {
    // console.log('partner e', e)
  }
  if (user && user._id) {
    return responseError(res, { status: 409, message: 'Conflict' });
  }

  let user2
  try {
    user2 = await userModel.getUserByName(name);
  } catch (e) {
    // console.log('partner e', e)
  }
  if (user2 && user2._id) {
    return responseError(res, { status: 409, message: 'Conflict' });
  }

  const hashedPw = await bcrypt.hash(password, 12)

  const data = {
    name,
    email,
    password: hashedPw,
    picture: null,
    locale: 'vi'
  }

  let result
  try {
    result = await userModel.createUser(data)
  } catch (e) {
    return responseError(res, e)
  }

  const profile = result
  if (!profile) return responseError(res, { message: "Error!!!" })
  const dataConfig = {
    _id: profile._id,
    name: profile.name,
    email: profile.email,
    picture: profile.picture,
    locale: profile.locale
  }
  const token = await signToken(dataConfig)

  res.json({token: token});
}

const loginByGoogle = async (req, res) => {
  const {
    token
  } = req.body || {};
  if ( !token) {
		return responseBadRequest(res);
  }

  const info = await decodeToken(token)

  let user 
  try {
    user = await userModel.getUserByEmail(info.email);
  } catch (e) {
    // console.log('partner e', e)
  }
  let tokenSystem
  if (user && user._id) {
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      locale: user.locale
    }
    tokenSystem = await signToken(data)

  }
  else{
    const data = {
      name: info.name + info.sub,
      email: info.email,
      picture: info.picture,
      locale: info.locale
    }
  
    let result
    try {
      result = await userModel.createUser(data)
    } catch (e) {
      return responseError(res, e)
    }
  
    if (!result) return responseError(res, { message: "Error!!!" })
  
    const dataConfig = {
      _id: result._id,
      name: result.name,
      email: result.email,
      picture: result.picture,
      locale: result.locale
    }
    tokenSystem = await signToken(dataConfig)
  
  }
  
  res.json({token: tokenSystem});
}

const loginByAdmin = async (req, res) => {
  const {
    email,
    password
  } = req.body || {};
  if ( !email || !password) {
		return responseBadRequest(res);
  }

  let user 
  try {
    user = await userModel.getUserByEmail(email);
  } catch (e) {
    // console.log('partner e', e)
  }
  if ( !user ) {
    return responseError(res, { status: 404, message: 'user not found' });
  }
  const isEqual = await bcrypt.compare(password, user.password)

  if (!isEqual) {
    return responseError(res, { status: 404, message: 'password is wrong' });
  }

  if(!user.role){
    return responseError(res, { status: 404, message: 'not auth' });
  }

  const data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    locale: user.locale,
    role: 'admin'
  }

  const token = await signToken(data)
  
  res.json({token});
}

const login = async (req, res) => {
  
  const {
    email,
    password
  } = req.body || {};
  if ( !email || !password) {
		return responseBadRequest(res);
  }
  console.log(email.toLowerCase(),
    password)
  let user 
  try {
    user = await userModel.getUserByEmail(email.toLowerCase());
  } catch (e) {
    // console.log('partner e', e)
  }
  console.log(user)
  if ( !user ) {
    return responseError(res, { status: 404, message: 'user not found' });
  }

  const isEqual = await bcrypt.compare(password, user.password)

  if (!isEqual) {
    return responseError(res, { status: 404, message: 'password is wrong' });
  }

  const data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    locale: user.locale
  }

  const token = await signToken(data)
  
  res.json({token});
}

const getDetailUser = async (req, res) => {
  const {
    _id,
  } = req.user || {};
  if ( !_id ) {
		return responseBadRequest(res);
  }

  let user 
  try {
    user = await userModel.getUserById(ObjectId(_id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!user) {
    return responseError(res, { status: 404, message: 'user not found' });
  }
  
  res.json(user);
}

const updateUser = async (req, res) => {
  const {
    id,
  } = req.params || {};
  const {
    name,
    email,
    picture,
    locale
  } = req.body || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let update = {
    name,
    email,
    picture,
    locale 
  }  

  let result
  try {
    result = await userModel.updateProfile(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }

  let user 
  try {
    user = await userModel.getUserById(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!user) {
    return responseError(res, { status: 404, message: 'user not found' });
  }
  
  res.json(user);
}

const refreshToken = async (req, res, next) => {
  try {
      const refreshTokenFromClient = req.body.refreshToken;
      if(!refreshTokenFromClient) return responseBadRequest(res);

      const decoded = await decodeToken(refreshTokenFromClient);
      
      const userFakeData = decoded.data;
      const token = await signToken(userFakeData);
      res.json({token});
    
  }
  catch (error) {
    return responseError(res, (e || {}));
  }

}

module.exports = {
  createUser,
  loginByGoogle,
  loginByAdmin,
  login,
  getDetailUser,
  updateUser,
  refreshToken
}