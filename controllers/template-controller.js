const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const templateModel = require("../model/template-model");

const {ObjectId} = require('mongodb')

const createTemplate = async (req, res) => {
  const {
    name,
    group,
    type,
    image,
    color,
  } = req.body || {};
  if ( !name || !group || !type ) {
		return responseBadRequest(res);
  }

  const data = {
    name,
    group,
    type,
    image,
    color,
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
  } = req.params || {};

  if(!page ){
    page = 0
  }
  if(!limit){
    limit = 2
  }

  let result
  try {
    result = await templateModel.getListTemplate(page, limit)
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
    group,
    type,
    image,
    color,
  } = req.body || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  const filter = {
    _id: ObjectId(id)
  }
  let update = {
    $set: { 
      name,
      group,
      type,
      image,
      color,
    }
  }  

  let result
  try {
    result = await templateModel.updateTemplate(filter, update);
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
  console.log(template)
  if (!template) {
    return responseError(res, { status: 404, message: 'template not found' });
  }
  
  res.json({template});
}


module.exports = {
  createTemplate,
  getListTemplate,
  updateTemplate,
  getDetailTemplate
}