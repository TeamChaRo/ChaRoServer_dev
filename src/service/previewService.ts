import { db } from '../models';
import { QueryTypes } from 'sequelize';
import { makePreview } from './makePreview';

import mapping from './mapping.json';

export async function getLikeTrend(userId: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                    FROM preview as P
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserId =:userId)
                    GROUP BY P.Id ORDER BY favoriteCount`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: userId },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg:
          '오늘은 7월 30일 4시 41분,, 저녁시간까진 50분.. 나는 0끼.. 배고파 죽겠다 떡볶이 먹고싶은데 님은 뭐드시고싶으세요?', //"successfully load Today's preview sorted by date",
        data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '게시글 더보기 실패',
      },
    };
  }
}

export async function getLikeTheme(userId: string, theme: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                      FROM preview as P
                      INNER JOIN detail 
                      LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserId =:userId)
                      WHERE detail.PostId=P.Id and detail.${theme}= 1
                      GROUP BY P.Id ORDER BY favoriteCount`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: userId },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '치키차카초코초코초코~ 복덩이 입냄새 ~~ 복덩복덩~', //"successfully load Today's preview sorted by date",
        data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '게시글 더보기 실패',
      },
    };
  }
}

export async function getLikeLocal(userId: string, local: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                        FROM preview as P
                        INNER JOIN detail
                        LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id) 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserId =:userId)
                        WHERE P.region =:region
                        GROUP BY P.Id ORDER BY favoriteCount`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: userId, region: mapping.region[local] },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '이 문구를 발견하셨다면 지금 당장 일어나 한승현과 어깨동무하고 털기춤을 추세요', //"successfully load Today's preview sorted by date",
        data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '게시글 더보기 실패',
      },
    };
  }
}

export async function getNewTrend(userId: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                      FROM preview as P
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserId =:userId)
                      GROUP BY P.Id ORDER BY date`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: userId },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '울랄라~ 훕뿌루삥뽕~ 이성현~', //"successfully load Today's preview sorted by date",
        data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '게시글 더보기 실패',
      },
    };
  }
}

export async function getNewTheme(userId: string, theme: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                        FROM preview as P
                        INNER JOIN detail 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserId =:userId)
                        WHERE detail.PostId=P.Id and detail.${theme}= 1
                        GROUP BY P.Id ORDER BY date`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: userId },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg:
          '오! 오예원은 오늘 1시에 기상했다. 예! 예,, 그렇습니다 어제 5시에 잤거든요. 원! 원..원 떡복이먹고싶다.', //"successfully load Today's preview sorted by date",
        data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '게시글 더보기 실패',
      },
    };
  }
}

export async function getNewLocal(userId: string, local: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                          DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                          FROM preview as P
                          INNER JOIN detail
                          LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserId =:userId)
                          WHERE P.region =:region
                          GROUP BY P.Id ORDER BY date`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: userId, region: mapping.region[local] },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '이미 개발해놓은 것들 따라가기 위해 분주한 중입니다.. 으샤으샤', //"successfully load Today's preview sorted by date",
        data: makePreview(result),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '게시글 더보기 실패',
      },
    };
  }
}
