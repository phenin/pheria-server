const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const templateModel = require("../model/template-model");

const {ObjectId} = require('mongodb')

const createTemplate = async (req, res) => {
  const {
    name,
    code,
    group,
    type,
    image,
    color,
  } = req.body || {};
  let { backgroundColor } = req.body || {};
  if ( !name || !group || !type ) {
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
    group,
    type,
    image,
    color,
    backgroundColor
  }

  let result
  try {
    result = await templateModel.createTemplate(data)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getListTemplate = async (req, res) => {

  let {
    page,
    limit,
  } = req.query || {};

  if(!page ){
    page = 1
  }
  if(!limit){
    limit = 5
  }

  let result
  try {
    result = await templateModel.getListTemplate(page, limit)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getListTemplateByGroup = async (req, res) => {
  const {
    group,
  } = req.params || {};

  let result
  try {
    result = await templateModel.getListTemplateByGroup(group)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const updateTemplate = async (req, res) => {
  const {
    id,
  } = req.params || {};
  const {
    name,
    code,
    group,
    type,
    image,
    color,
  } = req.body || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let update = {
    name,
    code,
    group,
    type,
    image,
    color,
  }  

  let result
  try {
    result = await templateModel.updateTemplate(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }

  let template 
  try {
    template = await templateModel.getTemplateById(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!template) {
    return responseError(res, { status: 404, message: 'template not found' });
  }
  
  res.json({result: template});
}

const getDetailTemplate = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let template 
  try {
    template = await templateModel.getTemplateById(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!template) {
    return responseError(res, { status: 404, message: 'template not found' });
  }
  
  res.json({template});
}

const deleteTemplate = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  try {
    await templateModel.hiddenTemplate(ObjectId(id));
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: 'success'});
}

module.exports = {
  createTemplate,
  getListTemplate,
  getListTemplateByGroup,
  updateTemplate,
  getDetailTemplate,
  deleteTemplate
}