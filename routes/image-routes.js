var express = require("express");
var router = express()

const image = require("../middleware/upload-images");

const imageController = require("../controllers/image-controller");

router.post('/', image.single('file'),
  imageController.upload
)

module.exports = router;