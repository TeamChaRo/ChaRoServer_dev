import express, { Request, Response } from 'express';
import config from '../config/config';

import loginService from '../service/loginService';

/* login */
const login = async function (req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await loginService.normalLogin(email, password);

  res.status(result.status).json(result.data);
};

export default {
  login,
};
