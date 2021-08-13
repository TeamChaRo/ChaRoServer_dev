import express from 'express';
const router = express.Router();
import { readController, searchController, utilController } from '../controller';

/**
 *  @route GET /post/main/:userEmail
 *  @desc 메인뷰 데이터 조회
 *  @access Public
 */
router.get('/main/:userEmail', readController.readMain);

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

/**
 *  @route POST /post/search/like
 *  @desc 검색하기 - 인기순
 *  @access Public
 */
router.post('/search/like', searchController.searchLikePost);

/**
 *  @route POST /post/search/new
 *  @desc 검색하기 - 최신순
 *  @access Public
 */
router.post('/search/new', searchController.searchNewPost);

/**
 *  @route POST /post/like
 *  @desc 게시물 좋아하기
 *  @access Public
 */
router.post('/like', utilController.like);

/**
 *  @route POST /post/new
 *  @desc 게시물 저장하기
 *  @access Public
 */
router.post('/save', utilController.save);

export default router;
