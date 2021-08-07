var express = require("express");
var router = express()

const auth = require("../middleware/auth");

const { authorizeJWTToken } = auth;

const commentController = require("../controllers/comment-controller");

router.post('/',
  authorizeJWTToken,
  commentController.createComment
)

router.put('/:id/reply',
  authorizeJWTToken,
  commentController.repliesComment
)

router.get('/:id',
  authorizeJWTToken,
  commentController.getListComment
)

router.patch('/:id',
  authorizeJWTToken,
  commentController.updateComment
)

router.delete('/:id',
  authorizeJWTToken,
  commentController.hiddenComment
)

module.exports = router;