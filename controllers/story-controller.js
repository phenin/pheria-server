const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const storyModel = require("../model/story-model");

const {ObjectId} = require('mongodb')

const createStory = async (req, res) => {
  const {
    title,
    content,
    type,
    template,
    image,
  } = req.body || {};
  if ( !title || !content || !type || !template ) {
		return responseBadRequest(res);
  }

  const data = {
    title,
    content,
    type,
    template,
    image,
  }

  let result
  try {
    result = await storyModel.createStory(data)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getDetailStory = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }
  console.log(id)

  let story 
  try {
    story = await storyModel.getStoryById(ObjectId(id));
  } catch (e) {
    // console.log('partner e', e)
  }
  if (!story) {
    return responseError(res, { status: 404, message: 'story not found' });
  }
  
  res.json({story});
}

const getListStory = async (req, res) => {
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
    result = await storyModel.getListStory(page, limit)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

module.exports = {
  createStory,
  getDetailStory,
  getListStory
}