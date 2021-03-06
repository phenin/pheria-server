var express = require("express");
var router = express()

const auth = require("../middleware/auth");

const { authorizeJWTToken, isAdmin } = auth;

const groupTemplateController = require("../controllers/group-template-controller");

router.post('/',
  authorizeJWTToken,
  isAdmin,
  groupTemplateController.createGroupTemplate
)

router.get('/',
  authorizeJWTToken,
  groupTemplateController.getListGroupTemplate
)

router.get('/pagination',
  authorizeJWTToken,
  isAdmin,
  groupTemplateController.getListGroupTemplatePagination
)

router.get('/:id',
  authorizeJWTToken,
  isAdmin,
  groupTemplateController.getDetailGroupTemplate
)

router.put('/:id',
  authorizeJWTToken,
  isAdmin,
  groupTemplateController.updateGroupTemplate
)

router.delete('/:id',
  authorizeJWTToken,
  isAdmin,
  groupTemplateController.hiddenGroupTemplate
)

module.exports = router;