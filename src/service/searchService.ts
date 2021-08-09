import { db } from '../models';
import { QueryTypes } from 'sequelize';

import searchDTO from '../interface/req/searchDTO';
import mapping from './mapping.json';

export async function getLikeSearch(option: number, search: searchDTO) {
  try {
    return {
      status: 200,
      data: {
        success: true,
        msg:
          '오늘은 8월 9일,, 기숙사와 빠이빠이하기까지 5일남았네요, 혼자만의 시간 좋았다... 위로좀 ㅠ',
        //data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '검색하기 인기순 조회 실패',
      },
    };
  }
}

export async function getNewSearch(option: number, search: searchDTO) {
  try {
    return {
      status: 200,
      data: {
        success: true,
        msg: '뚠뚠뚠 니나노,, 한승현으로 삼행시,, 한! 오예원 / 승! 귀엽다! / 현! 예원짱',
        //data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '검색하기 최신순 조회 실패',
      },
    };
  }
}
