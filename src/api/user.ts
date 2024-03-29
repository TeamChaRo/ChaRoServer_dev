import express from 'express';
import { check } from 'express-validator';
const router = express.Router();

import upload from '../middleware/upload';

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
router.post('/register', upload.profileImage, registerController.register);

/**
 *  @route POST /user/check/:userEmail
 *  @desc 이메일 중복 체크
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.get(
  '/check/email/:userEmail',
  check('userEmail', '이메일을 입력해주세요.').isEmail(),
  registerController.checkEmail
);

/**
 *  @route POST /user/auth
 *  @desc 이메일 인증(및 전송)
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/auth', registerController.authEmail);

/**
 *  @route POST /user/check/:nickname
 *  @desc 닉네임 중복 체크
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.get('/check/nickname/:nickname', registerController.checkNickname);

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
 *  @route POST /user/socialLogin
 *  @desc 소셜 로그인
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/socialLogin', loginController.socialLogin);

/**
 *  @route POST /user/register/kakao
 *  @desc 카카오 소셜 회원가입
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/register/kakao', registerController.kakaoRegister);

/**
 *  @route POST /user/register/google
 *  @desc 구글 소셜 회원가입
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/register/google', registerController.googleRegister);

/**
 *  @route POST /user/register/apple
 *  @desc 애플 소셜 회원가입
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/register/apple', registerController.appleRegister);

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

/**
 *  @route GET /user/follow/check?userEmail&targetEmail
 *  @desc 팔로잉 여부 전달
 *  @access Public
 */
router.get('/follow/check', utilController.getIsFollow);

/**
 *  @route GET /user/follow
 *  @desc 유저의 팔로우/팔로잉 목록 조회
 *  @access Public
 */
router.get('/follow', utilController.getFollowers);

/**
 *  @route GET /user/password
 *  @desc 유저 비밀번호 확인
 *  @access Public
 */
router.get('/password', utilController.checkPassword);

/**
 *  @route PUT /user/password
 *  @desc 유저 비밀번호 수정
 *  @access Public
 */
router.put('/password', utilController.modifyPassword);

/**
 *  @route DELETE /user/:userEmail
 *  @desc 회원 탈퇴
 *  @access Public
 */
router.delete('/:userEmail', utilController.deleteUser);

/**
 *  @route PUT /user/:userEmail
 *  @desc 회원 프로필 수정
 *  @access Public
 */
router.put('/:userEmail', upload.profileImage, utilController.modifyUser);

export default router;
