const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const backgroundModel = require("../model/background-model");

const {ObjectId} = require('mongodb')

const createBackground = async (req, res) => {
  const {
    name,
    code,
    backgroundColor,
    color,
    image
  } = req.body || {};
  if ( !name || !code || !backgroundColor || !color ) {
		return responseBadRequest(res);
  }

  if (backgroundColor.includes(",") ){
    backgroundColor = backgroundColor.split(',')
  }
  else if (backgroundColor.includes(" ") ){
    backgroundColor = backgroundColor.split(' ')
  }
  else if (backgroundColor.includes(", ") ){
    backgroundColor = backgroundColor.split(', ')
  }
  else if (backgroundColor.includes("|") ){
    backgroundColor = backgroundColor.split('|')
  }
  else if (backgroundColor.includes("/") ){
    backgroundColor = backgroundColor.split('/')
  }

  const data = {
    name,
    code,
    backgroundColor,
    color,
    image
  }

  let result
  try {
    result = await backgroundModel.createBackground(data)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getListBackgroundPagination = async (req, res) => {

  let {
    page,
    limit,
  } = req.params || {};

  if(!page ){
    page = 1
  }
  if(!limit){
    limit = 2
  }

  let result
  try {
    result = await backgroundModel.getListBackgroundPagination(page, limit)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getListBackground = async (req, res) => {

  let result
  try {
    result = await backgroundModel.getListBackground()
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const updateBackground = async (req, res) => {
  const {
    id,
  } = req.params || {};
  const {
    name,
    code,
    backgroundColor,
    color,
    image
  } = req.body || {};
  if ( !id ) {
		return responseBadRequest(res);
  }
  
  let update = {
    name,
    code,
    backgroundColor,
    color,
    image
  }  

  try {
    result = await backgroundModel.updateBackground(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

const getDetailBackground = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let background 
  try {
    background = await backgroundModel.getBackgroundById(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!background) {
    return responseError(res, { status: 404, message: 'background not found' });
  }
  
  res.json({background});
}

const hiddenBackground = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let background 
  try {
    background = await backgroundModel.hiddenBackground(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!background) {
    return responseError(res, { status: 404, message: 'background not found' });
  }
  
  res.json({result: 'success'});
}

module.exports = {
  createBackground,
  getListBackground,
  getListBackgroundPagination,
  updateBackground,
  getDetailBackground,
  hiddenBackground
}