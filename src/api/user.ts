import express from 'express';
import { check } from 'express-validator';
const router = express.Router();

import {
  loginController,
  registerController,
  myPageController,
  utilController,
} from '../controller';

/**
 *  @route POST /user/register
 *  @desc 일반 회원가입
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/register', registerController.register);

/**
 *  @route POST /user/register/email
 *  @desc 이메일 중복 체크
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post(
  '/register/email',
  check('email', '이메일을 입력해주세요.').isEmail(),
  registerController.checkEmail
);

/**
 *  @route POST /user/register/nickname
 *  @desc 닉네임 중복 체크
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/register/nickname', registerController.checkNickname);

/**
 *  @route POST /user/login
 *  @desc 일반 로그인
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post(
  '/login',
  [
    check('email', '이메일을 입력해주세요.').exists(),
    check('password', 'Password를 입력해주세요.').exists(),
  ],
  loginController.login
);

router.get('/myPage/like/:userEmail', myPageController.myPageLike);

/**
 *  @route GET /user/myPage/new/:userEmail
 *  @desc 마이페이지 정보 반환 - 최신순
 *  @access Public
 */
router.get('/myPage/new/:userEmail', myPageController.myPageNew);

/**
 *  @route GET /user/myPage/like/:userEmail/write/:postId/:count
 *  @desc 마이페이지 무한스크롤 - 저장/인기
 *  @access Public
 */
router.get('/myPage/like/:userEmail/write/:postId/:count', myPageController.myPageLikeMoreWrite);

/**
 *  @route GET /user/myPage/like/:userEmail/save/:postId/:count
 *  @desc 마이페이지 무한스크롤 - 저장/작성
 *  @access Public
 */
router.get('/myPage/like/:userEmail/save/:postId/:count', myPageController.myPageLikeMoreSave);

/**
 *  @route GET /user/myPage/new/:userEmail/write/:postId/:count
 *  @desc 마이페이지 무한스크롤 - 저장/인기
 *  @access Public
 */
router.get('/myPage/new/:userEmail/write/:postId', myPageController.myPageNewMoreWrite);

/**
 *  @route GET /user/myPage/new/:userEmail/save/:postId/:count
 *  @desc 마이페이지 무한스크롤 - 저장/작성
 *  @access Public
 */
router.get('/myPage/new/:userEmail/save/:postId', myPageController.myPageNewMoreSave);

/**
 *  @route POST /user/follow
 *  @desc 유저 팔로우 / 팔로우 취소
 *  @access Public
 */
router.post('/follow', utilController.follow);
export default router;
