import { db } from '../models';
import { registerDTO } from '../interface/req/registerDTO';
import { socialRegisterDTO } from '../interface/req/socialRegisterDTO';
import bcrypt from 'bcryptjs';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';
const normalRegister = async function (user: registerDTO) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordSalt = await bcrypt.hash(user.password, salt);
    user.password = passwordSalt;

    await db.User.create(user);

    return response.nsuccess(code.CREATED, msg.REGISTER_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
};

const validateEmail = async function (email: string) {
  try {
    const user = await db.User.findOne({ where: { email: email } });
    if (user) {
      return response.fail(code.CONFLICT, msg.ALREADY_EXIST_USER);
    }
    return response.nsuccess(code.CREATED, msg.REGISTER_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
};

const validateNickname = async function (nickname: string) {
  try {
    const user = await db.User.findOne({ where: { nickname: nickname } });
    if (user) {
      return response.fail(code.CONFLICT, msg.ALREADY_EXIST_USER);
    }
    return response.nsuccess(code.OK, msg.VALID_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
};

const socialRegister = async function (user: socialRegisterDTO) {
  try {
    db.User.create(user);
    return response.nsuccess(code.CREATED, msg.REGISTER_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
};

export default {
  normalRegister,
  validateEmail,
  validateNickname,
  socialRegister,
};
