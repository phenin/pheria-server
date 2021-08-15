const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const storyModel = require("../model/story-model");
const backgroundModel = require("../model/background-model");

const {ObjectId} = require('mongodb')

const createStory = async (req, res) => {
  const {
    title,
    contents,
    templates,
    image,
  } = req.body || {};

  let {
    background
  } = req.body || {};

  const {_id} = req.user

  if ( !title || !background || !contents || !templates ) {
		return responseBadRequest(res);
  }

  if(background.backgroundColor.length === 1 && 
    background.backgroundColor[0] === '#000000' && 
    background.color === '#ffffff'){
      background = await backgroundModel.getBackgroundDefault()
  }

  const data = {
    title,
    background,
    contents,
    templates,
    image,
    author: _id
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
  console.log("mé nó")
  const {
    id,
  } = req.params || {};
  if ( !id ) {
		return responseBadRequest(res);
  }

  let story 
  try {
    story = await storyModel.getStoryById(ObjectId(id));
    await storyModel.updateStory(ObjectId(id), {
      $addToSet: {
        views: ObjectId(req.user._id)
      }
    });

  } catch (e) {
    // console.log('partner e', e)
  }

  const liked = story.hearts.find(item => item.toString() === req.user._id)

  if (!story) {
    return responseError(res, { status: 404, message: 'story not found' });
  }
  
  res.json({story, liked: !!liked});
}

const getListStory = async (req, res) => {
  let {
    page,
    limit,
    status
  } = req.query || {};

  if(!page ){
    page = 1
  }
  if(!limit){
    limit = 5
  }

  let result
  try {
    result = await storyModel.getListStory(page, limit, {status})
  } catch (e) {
    return responseError(res, e)
  }

  res.json(result);

}

const updateStory = async (req, res) => {
  const {
    id,
  } = req.params || {};

  const {
    title,
    contents,
    templates,
    background,
    image,
  } = req.body || {};
  
  if ( !id ) {
		return responseBadRequest(res);
  }

  const data = {
    title,
    background,
    contents,
    templates,
    image,
    author: _id
  }

  let result
  try {
    result = await storyModel.updateStory(ObjectId(id), data);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: 'success'});
}

const heartStory = async (req, res) => {
  const {
    id,
  } = req.params || {};
  
  if ( !id ) {
		return responseBadRequest(res);
  }

  let update = {
    $addToSet: { 
      hearts: ObjectId(req.user._id)
    }
  }  

  let result
  try {
    result = await storyModel.updateStory(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: 'success'});
}

const unHeartStory = async (req, res) => {
  const {
    id,
  } = req.params || {};
  
  if ( !id ) {
		return responseBadRequest(res);
  }

  let update = {
    $pull: { 
      hearts: ObjectId(req.user._id)
    }
  }  

  let result
  try {
    result = await storyModel.updateStory(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: 'success'});
}


const censorshipStory = async (req, res) => {
  const {
    id,
  } = req.params || {};

  const {
    status,
    swearwords
  } = req.body || {};
  
  if ( !id ) {
		return responseBadRequest(res);
  }

  let update = {
    status,
    swearwords
  }  

  let result
  try {
    result = await storyModel.updateStory(ObjectId(id), update);
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json({result: 'success'});
}

const getUsersListStory = async (req, res) => {
  const {
    id,
  } = req.params || {};

  if ( !id ) {
		return responseBadRequest(res);
  }

  let result
  try {
    result = await storyModel.getYourListStory(ObjectId(id));
  } catch (e) {
    return responseError(res, (e || {}));
  }
  
  res.json(result);

}

const getMyListStory = async (req, res) => {

  let result
  try {
    result = await storyModel.getYourListStory(ObjectId(req.user._id));
  } catch (e) {
    return responseError(res, (e || {}));
  }  
  res.json(result);

}

module.exports = {
  createStory,
  getDetailStory,
  getListStory,
  updateStory,
  heartStory,
  unHeartStory,
  censorshipStory,
  getUsersListStory,
  getMyListStory
}