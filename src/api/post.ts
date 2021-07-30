import express from 'express';
const router = express.Router();
import { postController } from '../controller';

/**
 *  @route GET /post/detail/:userId/:postId
 *  @desc 게시글 상세정보 조회
 *  @access Public
 */
router.get('/detail/:userId/:postId', postController.readPost);

/**
 *  @route GET /post/like/:userId/:postId
 *  @desc 게시글 더보기 조회(인기순)
 *  @access Public
 */
router.get('/preview/like/:userId/:identifier', postController.readLikePreview);

/**
 *  @route GET /post/new/:userId/:postId
 *  @desc 게시글 더보기 조회(최신순)
 *  @access Public
 */
router.get('/preview/new/:userId/:identifier');
export default router;
