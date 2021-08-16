import { db } from '../models';
import { QueryTypes } from 'sequelize';
import { makePreview } from './makePreview';

import mapping from './mapping.json';

export async function getLikeTrend(userEmail: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                    FROM preview as P
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                    GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
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

export async function getLikeMoreTrend(userEmail: string, postId: string, count: string) {
  try {
    console.log(userEmail, postId, count);
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                    FROM preview as P
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                    GROUP BY P.Id 
                    HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                    ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, count: parseInt(count), postId: parseInt(postId) },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '무한스크롤 성공기념,,, 차로멘.',
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

export async function getLikeTheme(userEmail: string, theme: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                      FROM preview as P
                      INNER JOIN detail 
                      LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                      WHERE detail.PostId=P.Id and detail.${theme}= 1
                      GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '치키차카초코초코초코~ 복덩이 입냄새 ~~ 복덩복덩~',
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

export async function getLikeMoreTheme(
  userEmail: string,
  theme: string,
  postId: string,
  count: string
) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                      FROM preview as P
                      INNER JOIN detail 
                      LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                      WHERE detail.PostId=P.Id and detail.${theme}= 1
                      GROUP BY P.Id 
                      HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                      ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, count: parseInt(count), postId: parseInt(postId) },
      raw: true,
      nest: true,
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '테마 인기순 더보기 무한스크롤 성공 기원',
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

export async function getLikeLocal(userEmail: string, local: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                        FROM preview as P
                        INNER JOIN detail
                        LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id) 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE P.region =:region
                        GROUP BY P.Id 
                        ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, region: mapping.region[local] },
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

export async function getLikeMoreLocal(
  userEmail: string,
  local: string,
  postId: string,
  count: string
) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                        FROM preview as P
                        INNER JOIN detail
                        LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id) 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE P.region =:region
                        GROUP BY P.Id
                        HAVING (count(countLike.PreviewId) = :count and P.Id < :postId) 
                        ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        userEmail: userEmail,
        region: mapping.region[local],
        count: parseInt(count),
        postId: parseInt(postId),
      },
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

export async function getNewTrend(userEmail: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                      FROM preview as P
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                      GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
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

export async function getNewTheme(userEmail: string, theme: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                        FROM preview as P
                        INNER JOIN detail 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE detail.PostId=P.Id and detail.${theme}= 1
                        GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
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

export async function getNewLocal(userEmail: string, local: string) {
  try {
    const query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                          DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                          FROM preview as P
                          INNER JOIN detail
                          LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                          WHERE P.region =:region
                          GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, region: mapping.region[local] },
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
