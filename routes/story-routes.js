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
  authorizeJWTToken,
  storyController.getListStory
)


router.get('/:id',
  authorizeJWTToken,
  storyController.getDetailStory
)

router.patch('/:id/heart',
  authorizeJWTToken,
  storyController.heartStory
)

module.exports = router;