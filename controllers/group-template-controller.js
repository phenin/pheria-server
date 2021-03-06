const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const groupTemplateModel = require("../model/group-template-model");

const {ObjectId} = require('mongodb')

const createGroupTemplate = async (req, res) => {
  const {
    name,
    description,
    image
  } = req.body || {};
  if ( !name || !image ) {
		return responseBadRequest(res);
  }

  const data = {
    name,
    description,
    image
  }

  let result
  try {
    result = await groupTemplateModel.createGroupTemplate(data)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getListGroupTemplatePagination = async (req, res) => {

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
    result = await groupTemplateModel.getListGroupTemplatePagination(page, limit)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getListGroupTemplate = async (req, res) => {
  let result
  try {
    result = await groupTemplateModel.getListGroupTemplate()
    
  } catch (e) {
    return responseError(res, e)
  }
  res.json(result);

}

const updateGroupTemplate = async (req, res) => {
  const {
    id,
  } = req.params || {};
  const {
    name,
    description,
    image
  } = req.body || {};
  if ( !id ) {
		return responseBadRequest(res);
  }
  
  let update = {
    name,
    description,
    image
  }  

  try {
    result = await groupTemplateModel.updateGroupTemplate(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

const getDetailGroupTemplate = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let groupTemplate 
  try {
    groupTemplate = await groupTemplateModel.getGroupTemplateById(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!groupTemplate) {
    return responseError(res, { status: 404, message: 'groupTemplate not found' });
  }
  
  res.json({groupTemplate});
}

const hiddenGroupTemplate = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let groupTemplate 
  try {
    groupTemplate = await groupTemplateModel.hiddenGroupTemplate(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!groupTemplate) {
    return responseError(res, { status: 404, message: 'groupTemplate not found' });
  }
  
  res.json({result: 'success'});
}

module.exports = {
  createGroupTemplate,
  getListGroupTemplate,
  getListGroupTemplatePagination,
  updateGroupTemplate,
  getDetailGroupTemplate,
  hiddenGroupTemplate
}