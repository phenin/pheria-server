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
    image
  } = req.body || {};
  if ( !title || !content || !type ) {
		return responseBadRequest(res);
  }

  const data = {
    title,
    content,
    type,
    template,
    image,
    heart: 0
  }

  let result
  try {
    result = await storyModel.createStory(data)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

module.exports = {
  createStory
}