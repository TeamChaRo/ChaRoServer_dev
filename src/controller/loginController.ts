import express, { Request, Response } from 'express';
import config from '../config/config';

import loginService from '../service/loginService';

/* login */
const login = async function (req: Request, res: Response) {
  const { userEmail, password } = req.body;

  const result = await loginService.normalLogin(userEmail, password);

  res.status(result.status).json(result.data);
};

/* social login */
const socialLogin = async function (req: Request, res: Response) {
  const { userEmail } = req.body;

  const result = await loginService.socialLogin(userEmail);

  res.status(result.status).json(result.data);
};

export default {
  login,
  socialLogin,
};
