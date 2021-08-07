const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const commentModel = require("../model/comment-model");

const {ObjectId} = require('mongodb')

const createComment = async (req, res) => {
  const {
    story,
    content,
  } = req.body || {};

  if ( !story || !content ) {
		return responseBadRequest(res);
  }
  
  const data = {
    story,
    content,
    author: req.user._id
  }

  let result
  try {
    result = await commentModel.createComment(data)
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const repliesComment = async (req, res) => {
  const {
    content,
  } = req.body || {};

  const {
    id
  } = req.params || {};

  if ( !content || !id ) {
		return responseBadRequest(res);
  }
  
  const data = {
    content,
    author: req.user._id
  }

  let result
  try {
    result = await commentModel.repliesComment(ObjectId(id), {
      $push: {
        replies: data
      }
    })
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const getListComment = async (req, res) => {

  let {
    id
  } = req.params || {};

  if ( !id ) {
		return responseBadRequest(res);
  }

  let result
  try {
    result = await commentModel.getListComment(ObjectId(id))
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const updateComment = async (req, res) => {
  const {
    id,
  } = req.params || {};

  const {
    content
  } = req.body || {};

  if ( !id || !content ) {
		return responseBadRequest(res);
  }
  
  let update = {
    content
  }  

  try {
    result = await commentModel.updateComment(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

const hiddenComment = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }


  try {
    result = await commentModel.hiddenComment(ObjectId(id));
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

module.exports = {
  createComment,
  repliesComment,
  getListComment,
  updateComment,
  hiddenComment
}