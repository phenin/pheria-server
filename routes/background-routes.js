var express = require("express");
var router = express()

const auth = require("../middleware/auth");

const { authorizeJWTToken, isAdmin } = auth;

const backgroundController = require("../controllers/background-controller");

router.post('/',
  authorizeJWTToken,
  isAdmin,
  backgroundController.createBackground
)

router.get('/',
  authorizeJWTToken,
  backgroundController.getListBackground
)

router.get('/pagination',
  authorizeJWTToken,
  isAdmin,
  backgroundController.getListBackgroundPagination
)

router.get('/:id',
  authorizeJWTToken,
  isAdmin,
  backgroundController.getDetailBackground
)

router.put('/:id',
  authorizeJWTToken,
  isAdmin,
  backgroundController.updateBackground
)

router.delete('/:id',
  authorizeJWTToken,
  isAdmin,
  backgroundController.hiddenBackground
)

module.exports = router;