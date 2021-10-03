//import s3 from '../../../ChaRo-Server/src/Loaders/s3';
import s3 from '../loaders/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import config from '../config/config';

let upload = {
  postImages: multer({
    storage: multerS3({
      s3: s3,
      bucket: 'charo-image',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `post/${Date.now().toString()}${path.extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }).array('image', 6),

  profileImage: multer({
    storage: multerS3({
      s3: s3,
      bucket: 'charo-image',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `user/original/${Date.now().toString()}${path.extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('image'),
};

export = upload;
