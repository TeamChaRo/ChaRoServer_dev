import { db } from '../models';
import { QueryTypes } from 'sequelize';

export async function getLikeMyPage(userEmail: string) {
  try {
    return {
      status: 200,
      data: {
        success: true,
        msg: '8월 17일,, 새롭게 서버 연결할 생각하니 아찔하당... 무하하',
        //data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '마이페이지 인기순 실패',
      },
    };
  }
}

export async function getNewMyPage(userEmail: string) {
  try {
    return {
      status: 200,
      data: {
        success: true,
        msg: '8월 17일,, 새롭게 서버 연결할 생각하니 아찔하당... 무하하',
        //data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '마이페이지 최신순 실패',
      },
    };
  }
}
