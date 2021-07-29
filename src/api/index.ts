import express from 'express';
import postApi from './post';
const router = express.Router();

router.use('/post', postApi);
export default router;
