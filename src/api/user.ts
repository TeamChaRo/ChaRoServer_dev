import express from 'express';
import { check } from 'express-validator';
const router = express.Router();

import { loginController, registerController, myPageController } from '../controller';

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

/**
 *  @route GET /user/login/google
 *  @desc 구글 소셜 로그인 -> 클라딴에서 해당 URL로 redirect시켜줘야함
 *  @access Public
 */
router.get('/login/google', function (req, res) {
  res.redirect(loginController.googleURL);
});

/**
 *  @route GET /user/login/google/callback
 *  @desc 구글 소셜 로그인 결과 반환(유저 정보 반환)
 *  @access Public
 */
router.get('/login/google/callback', loginController.googleLogin);

/**
 *  @route GET /user/login/kakao
 *  @desc 카카오 소셜 로그인 -> 클라딴에서 해당 URL로 redirect시켜줘야함
 *  @access Public
 */
router.get('/login/kakao', function (req, res) {
  res.redirect(loginController.kakaoURL);
});

/**
 *  @route GET /user/login/kakao/callback
 *  @desc 카카오 소셜 로그인 결과 반환(유저 정보 반환)
 *  @access Public
 */
router.get('/login/kakao/callback', loginController.kakaoLogin);

/**
 *  @route GET /user/myPage/like/:userEmail
 *  @desc 마이페이지 정보 반환 - 인기순
 *  @access Public
 */
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

export default router;
