const multer = require('multer')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
) {
    cb(null, true)
} else {
    cb(null, false)
}
}

const upload = multer(
{ storage: fileStorage, 
    limits: {
    fileSize: 1024*1024*5
    }, 
    fileFilter: fileFilter 
})

module.exports = upload