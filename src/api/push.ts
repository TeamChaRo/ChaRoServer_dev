import express from 'express';
import { pushController } from '../controller';
const router = express.Router();

/**
 *  @route POST /push/read/:id
 *  @desc push 읽었을 때(읽음으로 표시 위함)
 *  @access Public
 */

router.post('/read', pushController.read);

export default router;
