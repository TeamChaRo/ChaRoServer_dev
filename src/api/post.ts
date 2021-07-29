import express from 'express';
const router = express.Router();
import { postController } from '../controller';

router.get('/detail/:userId/:postId', postController.readPost);

export default router;
