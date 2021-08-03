const {
  responseBadRequest,
  responseError,
} = require("../middleware/auth");

const storyModel = require("../model/story-model");

const {ObjectId} = require('mongodb')

const createStory = async (req, res) => {
  const {
    title,
    background,
    contents,
    templates,
    image,
  } = req.body || {};

  const {_id} = req.user

  if ( !title || !background || !contents || !templates ) {
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
  console.log(data)
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
  const filter = {
    _id: ObjectId(id)
  }

  let story 
  try {
    story = await storyModel.getStoryById(ObjectId(id));
    await storyModel.updateStory(filter, {
      $addToSet: {
        views: ObjectId(req.user._id)
      }
    });

  } catch (e) {
    // console.log('partner e', e)
  }

  if (!story) {
    return responseError(res, { status: 404, message: 'story not found' });
  }

  const templates = story.templates.map((item, index)=>{
    return {
      template: item.template._id,
      templateData: item.template,
      x: item.x,
      y: item.y,
      _id: item._id
    }
  })

  const convertStory = {
    title: story.title,
    background: story.background._id,
    backgroundData: story.background,
    templates: templates,
    contents: story.contents,
    image: story.image,
    author: story.author,
    hearts: story.hearts.length,
    views: story.views.length,
    comments: story.comments.length,
    status: story.status,
    music: story.music,
    datecreate: story.datecreate
  }
  
  res.json({story: convertStory});
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

module.exports = {
  createStory,
  getDetailStory,
  getListStory,
  heartStory,
  censorshipStory
}