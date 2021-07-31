import express, { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/config';

const oAuth2Client = new OAuth2Client(
  config.googleClientId,
  config.googleSecret,
  config.googleRedirect
);

const authorizeUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
});

const googleLogin = async function googleLoginController(req: Request, res: Response) {
  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code as string);
  oAuth2Client.setCredentials(tokens);

  /* refresh, access token */

  if (tokens.refresh_token) {
    console.log('리프레시 토큰 :', tokens.refresh_token);
  }
  console.log('액세스 토큰:', tokens.access_token);

  const ticket = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.googleClientId, // multiple clients면 여러개 client ID 사용 가능
  });
  const payload = ticket.getPayload();
  console.log('로그인 성공 ~ ~ ', payload);

  res.status(200).json({ msg: 'success~' });
};

export default {
  authorizeUrl,
  googleLogin,
};
