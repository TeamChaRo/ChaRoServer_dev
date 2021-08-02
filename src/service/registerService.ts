import { db } from '../models';
import { registerDTO } from '../interface/req/registerDTO';
import bcrypt from 'bcryptjs';

const normalRegister = async function (user: registerDTO) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordSalt = await bcrypt.hash(user.password, salt);
    user.password = passwordSalt;

    await db.User.create(user);

    return {
      status: 200,
      data: {
        success: true,
        msg:
          '회원가입 성공~ 오늘은 8월 2일 승현씨가 낭만을 토하며 낭만 2차 모임을 건의했다.. 과연 우리는 모일것인가?',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: 'Register DB upload error',
      },
    };
  }
};

export default {
  normalRegister,
};
