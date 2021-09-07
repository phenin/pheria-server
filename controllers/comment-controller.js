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

  let {
    limit, offset
  } = req.query || {}
  if ( !id ) {
		return responseBadRequest(res);
  }

  if(!limit) {
    limit = 10
  }
  if(!offset) {
    offset = 0
  } 

  const query = {
    limit, offset
  }

  let result
  try {
    result = await commentModel.getListComment(ObjectId(id), query)
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

const likeComment = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }
  let update = {
    $addToSet: { 
      likes: ObjectId(req.user._id)
    }
  }  
  try {
    result = await commentModel.updateComment(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

const unLikeComment = async (req, res) => {
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }
  let update = {
    $pull: { 
      likes: ObjectId(req.user._id)
    }
  }  
  try {
    result = await commentModel.updateComment(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

const likeReplyComment = async (req, res) => {
  const {
    id, replyId
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  console.log(id, replyId)
  
  let update = {
    $addToSet: { 
      'replies.$.likes': ObjectId(req.user._id)
    }
  }  
  try {
    result = await commentModel.likeReplyComment(ObjectId(id), ObjectId(replyId), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

const unLikeReplyComment = async (req, res) => {
  const {
    id, replyId
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }
  
  let update = {
    $pull: { 
      'replies.$.likes': ObjectId(req.user._id)
    }
  }  
  try {
    result = await commentModel.likeReplyComment(ObjectId(id), ObjectId(replyId), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: result});
}

const showRepliesComment = async (req, res) => {
  const {
    id
  } = req.params || {};

  if ( !id ) {
		return responseBadRequest(res);
  }

  let {
    limit, offset
  } = req.query || {}

  if(!limit) {
    limit = 5
  }
  if(!offset) {
    offset = 0
  } 

  const query = {
    limit, offset
  }
  
  try {
    result = await commentModel.showRepliesComment(ObjectId(id), query);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json(result);
}



module.exports = {
  createComment,
  repliesComment,
  getListComment,
  updateComment,
  hiddenComment,
  likeComment,
  unLikeComment,
  likeReplyComment,
  unLikeReplyComment,
  showRepliesComment
}