const multer  = require('multer');
const path = require('path');

const getUploadConfig = (rootpath) => {
  return multer({
    storage:multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', rootpath));
      },
      filename: function (req, file, cb) {
        cb(null, `${Date.now()}${Math.floor((Math.random() * 10) + 1)}${path.extname(file.originalname)}`);
      }
    }),
    fileFilter:(req, file, cb)=>{
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Upload only Picture!'), false)
      }
      cb(null, true)
    },
    limits: {
      fileSize: 20000000
    },
    onFileSizeLimit: function(file) {
      console.log('Failed: ' + file.originalname + ' is limited');
      fs.unlink(file.path);
    }
  });
}

module.exports = { getUploadConfig };