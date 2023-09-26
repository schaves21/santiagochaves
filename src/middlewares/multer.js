import multer from 'multer';
import path from 'path';
import { __dirname } from '../config.js';

// Define una función que generará el nombre de archivo único
const generateUniqueFileName = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    if (file.fieldname === 'profileImage') {
      uploadPath = path.join(__dirname, 'public', 'uploads', 'profiles');
    } else if (file.fieldname === 'productImage') {
      uploadPath = path.join(__dirname, 'public', 'uploads', 'products');
    } else if (file.fieldname === 'documents') {
      uploadPath = path.join(__dirname, 'public', 'uploads', 'documents');
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFileName() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
});

export default upload;
