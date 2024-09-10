import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Resolve the path to the 'public/temp' directory
const uploadDir = path.join('backend', '..', '..', 'public', 'temp');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // Use the resolved path for the destination
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save with the original file name
  }
});

export const upload = multer({ storage: storage });
