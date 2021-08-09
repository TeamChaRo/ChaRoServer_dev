import express, { Request, Response } from 'express';
import config from '../config/config';
import { validationResult } from 'express-validator';

import { registerDTO } from '../interface/req/registerDTO';
import registerService from '../service/registerService';
const register = async function (req: Request, res: Response) {
  const { email, userEmail, password, profileImage, nickname, pushAgree, emailAgree } = req.body;

  const user: registerDTO = {
    email: email,
    password: password,
    profileImage: profileImage,
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
  const { email } = req.body;

  const result = await registerService.validateEmail(email);
  res.status(result.status).json(result.data);
};

const checkNickname = async function (req: Request, res: Response) {
  const { nickanme } = req.body;

  const result = await registerService.validateNickname(nickanme);
  res.status(result.status).json(result.data);
};

export default {
  register,
  checkEmail,
  checkNickname,
};
