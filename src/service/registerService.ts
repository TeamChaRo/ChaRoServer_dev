import { db } from '../models';
import { registerDTO } from '../interface/req/registerDTO';
import { socialRegisterDTO } from '../interface/req/socialRegisterDTO';
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

const validateEmail = async function (email: string) {
  try {
    const user = await db.User.findOne({ where: { email: email } });
    if (user) {
      return {
        status: 409,
        data: {
          success: false,
          msg: '유효하지 않은 이메일이에요!! 빠꾸쳐주세요!!!!!',
        },
      };
    }
    return {
      status: 200,
      data: {
        success: true,
        msg:
          '유효한 이메일이에요~ 내가 가장 닮은 사람은 누구일까? 1. 윤후 2. 승희 3. 강아지똥 4. 성빈 ,, 난 이중에 성빈이라 생각하는데,, 너의 생각은 어떠니',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '이메일 중복체크 DB error',
      },
    };
  }
};

const validateNickname = async function (nickname: string) {
  try {
    const user = await db.User.findOne({ where: { nickname: nickname } });
    if (user) {
      return {
        status: 409,
        data: {
          success: false,
          msg: '유효하지 않은 닉네임!! 빠꾸쳐주세요!!!!!',
        },
      };
    }
    return {
      status: 200,
      data: {
        success: true,
        msg: '사용가능 닉네임이에요,, 너무 졸리다..',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '중복체크 DB error',
      },
    };
  }
};

const socialRegister = async function (user: socialRegisterDTO) {
  try {
    const result = await db.User.create(user);

    return {
      status: 200,
      data: {
        success: true,
        msg: '소셜로그인 가입 성공!',
        data: {
          email: result.email,
          nickname: result.nickname,
          profileImage: result.profileImage,
        },
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
  validateEmail,
  validateNickname,
  socialRegister,
};
