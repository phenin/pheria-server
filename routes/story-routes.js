var express = require("express");
var router = express()

const auth = require("../middleware/auth");

const { authorizeJWTToken } = auth;

const storyController = require("../controllers/story-controller");

router.post('/',
  authorizeJWTToken,
  storyController.createStory
)

router.get('/',
  storyController.getListStory
)

router.get('/:id',
  authorizeJWTToken,
  storyController.getDetailStory
)

router.put('/:id',
  authorizeJWTToken,
  storyController.updateStory
)

router.patch('/:id/heart',
  authorizeJWTToken,
  storyController.heartStory
)

router.patch('/:id/unHeart',
  authorizeJWTToken,
  storyController.unHeartStory
)

router.patch('/:id/censorship',
  authorizeJWTToken,
  storyController.censorshipStory
)

router.get('/get-users-list-story/:id',
  authorizeJWTToken,
  storyController.getUsersListStory
)

router.get('/get-my-list-story/mylist',
  authorizeJWTToken,
  storyController.getMyListStory
)

module.exports = router;