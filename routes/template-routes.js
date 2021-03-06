var express = require("express");
var router = express()

const auth = require("../middleware/auth");

const { authorizeJWTToken, isAdmin } = auth;

const templateController = require("../controllers/template-controller");

router.post('/',
  authorizeJWTToken,
  isAdmin,
  templateController.createTemplate
)

router.get('/',
  authorizeJWTToken,
  templateController.getListTemplate
)

router.get('/:id',
  authorizeJWTToken,
  templateController.getDetailTemplate
)

router.get('/group/:group',
  authorizeJWTToken,
  templateController.getListTemplateByGroup
)

router.put('/:id',
  authorizeJWTToken,
  isAdmin,
  templateController.updateTemplate
)

router.delete('/:id',
  authorizeJWTToken,
  isAdmin,
  templateController.deleteTemplate
)

module.exports = router;