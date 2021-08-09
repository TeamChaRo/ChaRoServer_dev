import express from 'express';
const router = express.Router();
import { readController } from '../controller';

/**
 *  @route GET /post/detail/:userEmail/:postId
 *  @desc 게시글 상세정보 조회
 *  @access Public
 */
router.get('/detail/:userEmail/:postId', readController.readPost);

/**
 *  @route GET /post/like/:userEmail/:postId
 *  @desc 게시글 더보기 조회(인기순)
 *  @access Public
 */
router.get('/preview/like/:userEmail/:identifier', readController.readLikePreview);

/**
 *  @route GET /post/new/:userEmail/:postId
 *  @desc 게시글 더보기 조회(최신순)
 *  @access Public
 */
router.get('/preview/new/:userEmail/:identifier', readController.readNewPreview);
export default router;
