import express from 'express';
const router = express.Router();
import {
  readController,
  searchController,
  utilController,
  writeController,
  searchHistoryController,
  postController,
} from '../controller';
import upload from '../middleware/upload';

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
 *  @route GET /post/like/:userEmail/:identifier
 *  @desc 게시글 더보기 조회(인기순)
 *  @access Public
 */
router.get('/preview/like/:userEmail/:identifier', readController.readLikePreview);

/**
 *  @route GET /post/new/:userEmail/:identifier
 *  @desc 게시글 더보기 조회(최신순)
 *  @access Public
 */
router.get('/preview/new/:userEmail/:identifier', readController.readNewPreview);

/**
 *  @route GET /post/like/:userEmail/:identifier/:postId
 *  @desc 게시글 더보기 조회(인기순) - 무한스크롤
 *  @access Public
 */
router.get(
  '/preview/like/:userEmail/:identifier/:postId/:count',
  readController.readLikeMorePreview
);

/**
 *  @route GET /post/new/:userEmail/:identifier/:postId
 *  @desc 게시글 더보기 조회(최신순) - 무한스크롤
 *  @access Public
 */
router.get('/preview/new/:userEmail/:identifier/:postId', readController.readNewMorePreview);

/**
 *  @route POST /post/search/like
 *  @desc 검색하기 - 인기순
 *  @access Public
 */
router.post('/search/like', searchController.searchLikePost);

/**
 *  @route POST /post/search/like/more
 *  @desc 검색하기 - 인기순(무한스크롤)
 *  @access Public
 */
router.post('/search/like/more', searchController.searchLikeMorePost);

/**
 *  @route POST /post/search/new
 *  @desc 검색하기 - 최신순
 *  @access Public
 */
router.post('/search/new', searchController.searchNewPost);

/**
 *  @route POST /post/search/new/more
 *  @desc 검색하기 - 최신순(무한스크롤)
 *  @access Public
 */
router.post('/search/new/more', searchController.searchNewMorePost);

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

/**
 *  @route POST /post/write
 *  @desc 게시물 작성하기
 *  @access Public
 */
router.post('/write', upload.postImages, writeController.writePost);

/**
 *  @route POST /post/saveHistory
 *  @desc 게시글 작성 시 출발/경유/목적 검색 기록 저장
 *  @access Public
 */
router.post('/saveHistory', searchHistoryController.saveHistory);

/**
 *  @route POST /post/readHistory
 *  @desc 게시글 작성 시 출발/경유/목적 검색 기록 조회
 *  @access Public
 */
router.get('/readHistory/:userEmail', searchHistoryController.readHistory);

/**
 *  @route GET /post/likes/:postId?userEmail
 *  @desc 게시글 작성 시 출발/경유/목적 검색 기록 조회
 *  @access Public
 */
router.get('/likes/:postId', utilController.getLikes);

/**
 *  @route DELETE /post/delete/:postId
 *  @desc 게시글 삭제
 *  @access Public
 */
router.delete('/:postId', postController.deletePost);

/**
 *  @route PUT /post
 *  @desc 게시글 수정
 *  @access Public
 */

router.put('/', postController.modifyPost);
export default router;
