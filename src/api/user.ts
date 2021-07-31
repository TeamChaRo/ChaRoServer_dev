import express from 'express';
const router = express.Router();

import { loginController } from '../controller';
/**
 *  @route GET /user/login/google
 *  @desc 구글 소셜 로그인 -> 클라딴에서 해당 URL로 redirect시켜줘야함
 *  @access Public
 */
router.get('/login/google', function (req, res) {
  res.redirect(loginController.authorizeUrl);
});

/**
 *  @route GET /user/login/google/callback
 *  @desc 구글 소셜 로그인 결과 반환(유저 정보 반환)
 *  @access Public
 */
router.get('/login/google/callback', loginController.googleLogin);

export default router;
