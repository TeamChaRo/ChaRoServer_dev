import { db } from '../models';
import { QueryTypes } from 'sequelize';
import { makePreview } from './makePreview';

import searchDTO from '../interface/req/searchDTO';
import mapping from './mapping.json';

/*
[검색 옵션 parsing] = option
------------- 1개 -------------
- 0 : region 
- 1 : theme
- 2 : warning
------------- 2개 -------------
- 3 : region, theme
- 4 : region, warning
- 5 : theme, warning
------------- 3개 -------------
- 6 : region, theme, warning
*/

export async function getLikeSearch(option: number, search: searchDTO) {
  try {
    let query: string, result: object[];

    if (option == 0) {
      // region
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                        FROM preview as P
                        LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id) 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE P.region =:region
                        GROUP BY P.Id ORDER BY favoriteCount`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else if (option == 1) {
      // theme
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                FROM preview as P
                INNER JOIN detail 
                LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                WHERE detail.PostId=P.Id and detail.${search.theme}= 1
                GROUP BY P.Id ORDER BY favoriteCount`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail },
        raw: true,
        nest: true,
      });
    } else if (option == 2) {
      // warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                      FROM preview as P
                      INNER JOIN detail 
                      LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                      WHERE detail.PostId=P.Id and detail.${search.warning}= 0
                      GROUP BY P.Id ORDER BY favoriteCount`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail },
        raw: true,
        nest: true,
      });
    } else if (option == 3) {
      // region, theme
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                      FROM preview as P
                      INNER JOIN detail 
                      LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                      WHERE detail.PostId=P.Id and detail.${search.theme}= 1 and P.region =:region
                      GROUP BY P.Id ORDER BY favoriteCount`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else if (option == 4) {
      //region, warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                FROM preview as P
                INNER JOIN detail 
                LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and P.region =:region
                GROUP BY P.Id ORDER BY favoriteCount`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else if (option == 5) {
      //theme, warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                FROM preview as P
                INNER JOIN detail 
                LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1 and P.region =:region
                GROUP BY P.Id ORDER BY favoriteCount`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else {
      // region, theme, warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                FROM preview as P
                INNER JOIN detail 
                LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1
                GROUP BY P.Id ORDER BY favoriteCount`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail },
        raw: true,
        nest: true,
      });
    }
    return {
      status: 200,
      data: {
        success: true,
        msg:
          '오늘은 8월 9일,, 기숙사와 빠이빠이하기까지 5일남았네요, 혼자만의 시간 좋았다... 위로좀 ㅠ',
        data: makePreview(result),
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
    let query: string, result: object[];

    if (option == 0) {
      // region
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                        FROM preview as P
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE P.region =:region
                        GROUP BY P.Id ORDER BY date`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else if (option == 1) {
      // theme
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                        FROM preview as P
                        INNER JOIN detail 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE detail.PostId=P.Id and detail.${search.theme}= 1
                        GROUP BY P.Id ORDER BY date`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail },
        raw: true,
        nest: true,
      });
    } else if (option == 2) {
      // warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                        FROM preview as P
                        INNER JOIN detail 
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE detail.PostId=P.Id and detail.${search.warning}= 0
                        GROUP BY P.Id ORDER BY date`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail },
        raw: true,
        nest: true,
      });
    } else if (option == 3) {
      // region, theme
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                      FROM preview as P
                      INNER JOIN detail 
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                      WHERE detail.PostId=P.Id and detail.${search.theme}= 1 and P.region =:region
                      GROUP BY P.Id ORDER BY date`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else if (option == 4) {
      //region, warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                FROM preview as P
                INNER JOIN detail 
                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and P.region =:region
                GROUP BY P.Id ORDER BY date`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else if (option == 5) {
      //theme, warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                FROM preview as P
                INNER JOIN detail 
                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1 and P.region =:region
                GROUP BY P.Id ORDER BY date`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
        raw: true,
        nest: true,
      });
    } else {
      // region, theme, warning
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                FROM preview as P
                INNER JOIN detail 
                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1
                GROUP BY P.Id ORDER BY date`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail },
        raw: true,
        nest: true,
      });
    }
    return {
      status: 200,
      data: {
        success: true,
        msg: '뚠뚠뚠 니나노,, 한승현으로 삼행시,, 한! 오예원 / 승! 귀엽다! / 현! 예원짱',
        data: makePreview(result),
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
