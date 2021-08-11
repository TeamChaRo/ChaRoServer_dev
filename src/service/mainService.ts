import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { mainDTO, bannerDTO } from '../interface/res/mainDTO';
import mapping from './mapping.json';

export async function getMain(userEmail: string) {
  try {
    return {
      status: 200,
      data: {
        success: true,
        msg: '오늘은 8월 10일 요 새로운 서버는 연결을 언제하자하는게 좋을까? 눈난뇨',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '메인뷰 조회 실패',
      },
    };
  }
}
