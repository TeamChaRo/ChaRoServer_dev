import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import config from '../config/config';
import transporter from '../loaders/smtp';

import { registerDTO } from '../interface/req/registerDTO';
import { socialRegisterDTO } from '../interface/req/socialRegisterDTO';

import registerService from '../service/registerService';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

const register = async function (req: Request, res: Response) {
  let profileImage: string;
  if (req.file) {
    profileImage = (req.file as Express.MulterS3.File).location;
  }

  const { userEmail, password, nickname, pushAgree, emailAgree } = req.body;
  if (!userEmail || !password || !nickname || pushAgree == null || emailAgree== null) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const user: registerDTO = {
    email: userEmail,
    password: password,
    profileImage: profileImage ? profileImage : config.defaultImage,
    nickname: nickname,
    marketingPush: pushAgree,
    marketingEmail: emailAgree,
  };

  const result = await registerService.normalRegister(user);
  res.status(result.status).json(result.data);
};

const checkEmail = async function (req: Request, res: Response) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(404).json({ success: false, msg: '올바른 이메일 형식을 입력해주세요!' });
  }

  const { userEmail } = req.params;

  if (!userEmail) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const result = await registerService.validateEmail(userEmail);
  res.status(result.status).json(result.data);
};

const authEmail = async function (req: Request, res: Response) {
  const { userEmail } = req.body;

  if (!userEmail) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  /* min ~ max까지 랜덤으로 숫자를 생성하는 함수 */
  var generateRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randNum = generateRandom(111111, 999999);
  const mailOptions = {
    from: `"ChaRo Team" <${config.mailerId}>`,
    to: userEmail,
    subject: '[차로]인증 관련 이메일 입니다',
    text: '오른쪽 숫자 6자리를 입력해주세요 : ' + randNum,
  };

  transporter.sendMail(mailOptions, (error, responses) => {
    if (error) {
      return res.status(500).json({ success: false, msg: '메일 전송 실패 - 서버' });
    } else {
      /* 클라이언트에게 인증 번호를 보내서 사용자가 맞게 입력하는지 확인! */
      return res.status(200).json({
        success: true,
        msg: '메일 전송 성공! 인증번호 비교해주세요',
        data: randNum.toString(),
      });
    }
  });
};

const checkNickname = async function (req: Request, res: Response) {
  const { nickname } = req.params;

  if (!nickname) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const result = await registerService.validateNickname(nickname);
  res.status(result.status).json(result.data);
};

const kakaoRegister = async function (req: Request, res: Response) {
  const { userEmail, profileImage, nickname, pushAgree, emailAgree } = req.body;

  if (!userEmail || !nickname || !pushAgree || !emailAgree) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const user: socialRegisterDTO = {
    email: userEmail,
    profileImage: profileImage ? profileImage : config.defaultImage,
    nickname: nickname,
    marketingPush: pushAgree,
    marketingEmail: emailAgree,
  };

  const result = await registerService.socialRegister(user);
  res.status(result.status).json(result.data);
};

const googleRegister = async function (req: Request, res: Response) {
  const { userEmail, profileImage, pushAgree, emailAgree } = req.body;

  if (!userEmail || !pushAgree || !emailAgree) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  /* min ~ max까지 랜덤으로 숫자를 생성하는 함수 */
  var generateRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const nickname: string = '상큼발랄' + generateRandom(1111, 9999).toString();
  const user: socialRegisterDTO = {
    email: userEmail,
    profileImage: profileImage ? profileImage : config.defaultImage,
    nickname: nickname,
    marketingPush: pushAgree,
    marketingEmail: emailAgree,
  };

  const result = await registerService.socialRegister(user);
  res.status(result.status).json(result.data);
};

const appleRegister = async function (req: Request, res: Response) {
  const { userEmail, pushAgree, emailAgree } = req.body;

  if (!userEmail || !pushAgree || !emailAgree) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  /* min ~ max까지 랜덤으로 숫자를 생성하는 함수 */
  var generateRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const nickname: string = '둥기둥기' + generateRandom(1111, 9999).toString();
  const user: socialRegisterDTO = {
    email: userEmail,
    profileImage: config.defaultImage,
    nickname: nickname,
    marketingPush: pushAgree,
    marketingEmail: emailAgree,
  };

  const result = await registerService.socialRegister(user);
  res.status(result.status).json(result.data);
};

export default {
  register,
  checkEmail,
  authEmail,
  checkNickname,
  kakaoRegister,
  googleRegister,
  appleRegister,
};
