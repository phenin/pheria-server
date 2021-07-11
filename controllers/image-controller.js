const {
  responseBadRequest,
} = require("../middleware/auth");

const upload = async (req, res) => {
  let image = null

  if ( !req.file ) {
		return responseBadRequest(res);
  }
  image = req.file.path

  res.json({url: image});

}

module.exports = {
  upload
}