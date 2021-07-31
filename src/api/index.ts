import express from 'express';
import postApi from './post';
import userApi from './user';
const router = express.Router();

// API - user
router.use('/user', userApi);

// API - post
router.use('/post', postApi);
export default router;
