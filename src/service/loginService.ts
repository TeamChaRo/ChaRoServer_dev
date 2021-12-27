import { db } from '../models';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

import { loginDTO } from '../interface/res/loginDTO';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

const normalLogin = async function (email: string, password: string) {
  try {
    const user = await db.User.findOne({ where: { email: email } }).catch((err) => {
      throw err;
    });

    if (!user) {
      return response.fail(code.NOT_FOUND, msg.NO_USER);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const data: loginDTO = {
        email: user.email,
        nickname: user.nickname,
        profileImage: user.profileImage,
        isSocial: false,
      };
      return response.success(code.OK, msg.LOGIN_SUCCESS, data);
    } else {
      return response.fail(code.NOT_FOUND, msg.LOGIN_FAIL);
    }
    
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
};

const socialLogin = async function (email: string) {
  try {
    const user = await db.User.findOne({ where: { email: email } });

    if (!user) {
      return response.fail(code.NOT_FOUND, msg.NO_USER);
    }

    const data: loginDTO = {
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      isSocial: true,
    };
    return response.success(code.OK, msg.LOGIN_SUCCESS, data);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
};

export default {
  normalLogin,
  socialLogin,
};
