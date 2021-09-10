var express = require("express");
var router = express()

const auth = require("../middleware/auth");

const { authorizeJWTToken } = auth;

const userController = require("../controllers/user-controller");

router.post('/sign-up',
  userController.createUser
)

router.post('/login-by-google',
  userController.loginByGoogle
)

router.post('/login-by-admin',
  userController.loginByAdmin
)

router.post('/login',
  userController.login
)

router.get('/profile',
  authorizeJWTToken,
  userController.getDetailUser
)

router.post('/profile',
  authorizeJWTToken,
  userController.getDetailUserX
)

router.put('/update-user/:id',
  authorizeJWTToken,
  userController.updateUser
)

router.post('/refresh',
  userController.refreshToken
)

router.post('/validateName',
  userController.validateName
)

module.exports = router;