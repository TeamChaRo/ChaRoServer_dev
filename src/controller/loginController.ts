import express, { Request, Response } from 'express';
import config from '../config/config';

import loginService from '../service/loginService';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

/* login */
const login = async function (req: Request, res: Response) {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }
  const result = await loginService.normalLogin(userEmail, password);

  res.status(result.status).json(result.data);
};

/* social login */
const socialLogin = async function (req: Request, res: Response) {
  const { userEmail } = req.body;

  if (!userEmail) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }
  const result = await loginService.socialLogin(userEmail);

  res.status(result.status).json(result.data);
};

export default {
  login,
  socialLogin,
};
