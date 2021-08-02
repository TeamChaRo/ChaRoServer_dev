import { db } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const normalLogin = async function (id: string, password: string) {
  try {
    const user = await db.User.findOne({ where: { Id: id } });

    if (!user) {
      return {
        status: 404,
        data: {
          success: false,
          msg: '해당 아이디가 없습니다.',
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
            userId: user.Id,
            nickname: user.nickname,
            //token: await token(),
            profileImage: user.profileImage,
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

export default {
  normalLogin,
};