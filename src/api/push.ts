import express from 'express';
import { pushController } from '../controller';
const router = express.Router();

/**
 *  @route POST /push/read
 *  @desc push 읽었을 때(읽음으로 표시 위함)
 *  @access Public
 */

router.post('/read', pushController.read);

/**
 *  @route DELETE /push/remove/:id
 *  @desc push 삭제
 *  @access Public
 */
router.delete('/remove/:pushId', pushController.remove);

/**
 *  @route GET /push/:userEmail
 *  @desc push 삭제
 *  @access Public
 */
router.get('/:userEmail', pushController.getList);

/**
 *  @route POST /push/fcm
 *  @desc fcm 토큰 업데이트
 *  @access Public
 */
router.post('/fcm', pushController.updateFcm);

export default router;
