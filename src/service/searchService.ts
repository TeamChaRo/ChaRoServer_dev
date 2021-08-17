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
                        GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

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
                GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

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
                      GROUP BY P.Id ORDER BY favoriteCount DESC LIMIT 10`;

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
                      GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

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
                GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

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
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1 
                GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail },
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
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1 and P.region =:region
                GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, region: search.region },
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

export async function getLikeMoreSearch(
  option: number,
  search: searchDTO,
  postId: string,
  count: string
) {
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
                        GROUP BY P.Id 
                        HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                        ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          count: parseInt(count),
          postId: parseInt(postId),
        },
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
                GROUP BY P.Id 
                HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          count: parseInt(count),
          postId: parseInt(postId),
        },
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
                      GROUP BY P.Id 
                      HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                      ORDER BY favoriteCount DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          count: parseInt(count),
          postId: parseInt(postId),
        },
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
                      GROUP BY P.Id 
                      HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                      ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          count: parseInt(count),
          postId: parseInt(postId),
        },
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
                GROUP BY P.Id 
                HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          count: parseInt(count),
          postId: parseInt(postId),
        },
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
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1 
                GROUP BY P.Id 
                HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          count: parseInt(count),
          postId: parseInt(postId),
        },
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
                WHERE detail.PostId=P.Id and detail.${search.warning}= 0 and detail.${search.theme}= 1 and P.region =:region
                GROUP BY P.Id 
                HAVING (count(countLike.PreviewId) = :count and P.Id < :postId)
                ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          count: parseInt(count),
          postId: parseInt(postId),
        },
        raw: true,
        nest: true,
      });
    }
    return {
      status: 200,
      data: {
        success: true,
        msg: '검색하기 무한스크롤입니당~',
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
                        GROUP BY P.Id ORDER BY P.Id DESC LIMIT 2`;

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
                        GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

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
                        GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

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
                      GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

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
                GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

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
                GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

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
                GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

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

export async function getNewMoreSearch(option: number, search: searchDTO, postId: string) {
  try {
    let query: string, result: object[];

    if (option == 0) {
      // region
      query = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite
                        FROM preview as P
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE P.region =:region
                        GROUP BY P.Id 
                        HAVING P.Id < :postId
                        ORDER BY P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          postId: parseInt(postId),
        },
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
                        GROUP BY P.Id 
                        HAVING P.Id < :postId
                        ORDER BY P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, postId: parseInt(postId) },
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
                        GROUP BY P.Id 
                        HAVING P.Id < :postId
                        ORDER BY P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, postId: parseInt(postId) },
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
                      GROUP BY P.Id 
                      HAVING P.Id < :postId
                      ORDER BY P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          postId: parseInt(postId),
        },
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
                GROUP BY P.Id 
                HAVING P.Id < :postId
                ORDER BY P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          postId: parseInt(postId),
        },
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
                GROUP BY P.Id 
                HAVING P.Id < :postId
                ORDER BY P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          userEmail: search.userEmail,
          region: search.region,
          postId: parseInt(postId),
        },
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
                GROUP BY P.Id 
                HAVING P.Id < :postId
                ORDER BY P.Id DESC LIMIT 10`;

      result = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: search.userEmail, postId: parseInt(postId) },
        raw: true,
        nest: true,
      });
    }
    return {
      status: 200,
      data: {
        success: true,
        msg: '검색하기 최신순 무한스크롤임나당~',
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
