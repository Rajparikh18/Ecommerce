import multer from "multer"
// the below code is directly used from the documentation of multure
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({
     storage, // instead of this we can use storage:storage why because of latest version
    })
  