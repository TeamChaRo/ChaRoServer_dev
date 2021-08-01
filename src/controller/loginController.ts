import express, { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/config';

/* Google */
const google = new OAuth2Client(config.googleClientId, config.googleSecret, config.googleRedirect);

const googleURL = google.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
});

const googleLogin = async function (req: Request, res: Response) {
  const code = req.query.code;
  const { tokens } = await google.getToken(code as string);
  google.setCredentials(tokens);

  const ticket = await google.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.googleClientId, // multiple clients면 여러개 client ID 사용 가능
  });
  const payload = ticket.getPayload();

  const email = payload.email;
  const nickname = payload.name;

  console.log('로그인 성공!', email, nickname);
  res.status(200).json({ success: true, msg: '구글 로그인 성공!' });
};

/* Kakao */
const kakao = {
  clientID: config.kakaoClientId,
  clientSecret: config.kakaoSecret,
  redirectUri: config.kakaoRedirect,
};

const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;

const kakaoLogin = async function (req: Request, res: Response) {
  let token: any, user: any;
  try {
    //access토큰을 받기 위한 코드
    token = await axios({
      //token
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code', //특정 스트링
        client_id: kakao.clientID,
        client_secret: kakao.clientSecret,
        redirectUri: kakao.redirectUri,
        code: req.query.code, //결과값을 반환했다. 안됐다.
      }), //객체를 string 으로 변환
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: '카카오 토큰 발급 실패' });
  }

  try {
    user = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      }, //헤더에 내용을 보고 보내주겠다.
    });

    // user에게서 필요한 정보
    const data = user.data;
    const email = data.kakao_account.email;
    const nickname = data.properties.nickname;

    console.log('로그인 성공!', email, nickname);

    res.status(200).json({ success: true, msg: '카카오 로그인 성공!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: '카카오 로그인 실패' });
  }
};

export default {
  googleURL,
  googleLogin,
  kakaoURL,
  kakaoLogin,
};
