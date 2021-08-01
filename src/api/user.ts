import express from 'express';
import { check } from 'express-validator';
const router = express.Router();

import { loginController } from '../controller';

/**
 *  @route POST /user/login
 *  @desc 일반 로그인
 *  @access Public <- Private설정을 따로 할 수 있는가?
 */
router.post('/login', [
  check('userId', 'ID를 입력해주세요.').exists(),
  check('password', 'Password를 입력해주세요.').exists(),
  loginController.login,
]);

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

export default router;
