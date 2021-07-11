var express = require("express");
var router = express()

const auth = require("../middleware/auth");

const { authorizeJWTToken } = auth;

const storyController = require("../controllers/story-controller");

router.post('/',
storyController.createStory
)

// router.get('/:id',
//   authorizeJWTToken,
//   storyController.getDetailUser
// )

// router.put('/:id',
//   authorizeJWTToken,
//   storyController.updateUser
// )

module.exports = router;