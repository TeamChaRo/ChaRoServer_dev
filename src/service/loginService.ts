import { db } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const normalLogin = async function (email: string, password: string) {
  try {
    const user = await db.User.findOne({ where: { email: email } });

    if (!user) {
      return {
        status: 404,
        data: {
          success: false,
          msg: '해당 유저가 없습니다.',
        },
      };
    }

    if (user.password == password) {
      return {
        status: 200,
        data: {
          success: true,
          msg: '로그인에 성공하였습니다.',
          data: {
            email: user.email,
            nickname: user.nickname,
            //token: await token(),
            profileImage: user.profileImage,
            isSocial: false,
          },
        },
      };
    } else {
      return {
        status: 404,
        data: {
          success: false,
          msg: '로그인 실패!',
        },
      };
    }
    /*
    //Encrpyt password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        status: 404,
        data: {
          success: false,
          msg: '비밀번호가 없습니다.',
        },
      };
    }
    
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.Id,
      },
    };

    function token() {
      return new Promise((resolve, reject) => {
        jwt.sign(payload, config.jwtSecret, { expiresIn: 36000 }, (err, token) => {
          if (err) throw err;
          else resolve(token);
        });
      });
    }
    

    return {
      status: 200,
      data: {
        success: true,
        msg: '로그인에 성공하였습니다.',
        data: {
          userId: user.Id,
          nickname: user.nickname,
          token: await token(),
          profileImage: user.profileImage,
        },
      },
    };
    */
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: 'DB error',
      },
    };
  }
};

const socialLogin = async function (email: string) {
  try {
    const user = await db.User.findOne({ where: { email: email } });

    if (!user) {
      return {
        status: 401,
        data: {
          success: false,
          msg: '해당 유저가 없습니다. 회원가입 API 요청해주세요!',
        },
      };
    }

    return {
      status: 200,
      data: {
        success: true,
        msg: '로그인에 성공하였습니다.',
        data: {
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profileImage,
          isSocial: true,
        },
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '소셜 로그인 - 유저목록 불러오기 에러',
      },
    };
  }
};

export default {
  normalLogin,
  socialLogin,
};
