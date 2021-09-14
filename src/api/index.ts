import express from 'express';
import postApi from './post';
import userApi from './user';
import pushApi from './push';
const router = express.Router();

// API - user
router.use('/user', userApi);

// API - post
router.use('/post', postApi);

// API - push
router.use('/push', pushApi);
export default router;
