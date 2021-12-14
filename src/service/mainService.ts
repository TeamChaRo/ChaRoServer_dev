import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { mainDTO, bannerDTO } from '../interface/res/mainDTO';
import { makePreview } from './makePreview';
import mapping from './mapping.json';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

export async function getMain(userEmail: string, theme: string, region: string) {
  try {
    const bannerPromise = db.Banner.findAll({ limit: 4, raw: true, nest: true });
    const initQuery = `SELECT C.customThemeTitle, L.localTitle 
                            FROM customTheme AS C JOIN local AS L 
                            WHERE C.customTheme=:theme AND L.localCity=:region`;

    const initPromise = db.sequelize.query(initQuery, {
      type: QueryTypes.SELECT,
      replacements: { theme: theme, region: region },
      raw: true,
      nest: true,
    });

    // Trend - 좋아요 순
    const trendQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                              DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                              FROM preview as P
                              LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                              LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                              GROUP BY P.Id ORDER BY favoriteCount DESC LIMIT 4`;

    const trendPromise = db.sequelize.query(trendQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    //custom 된 테마 게시글 모아오기
    const themeQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                      DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                      FROM preview as P
                      INNER JOIN detail 
                      LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                      LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                      WHERE detail.PostId=P.Id and detail.${theme}= 1
                      GROUP BY P.Id ORDER BY favoriteCount DESC LIMIT 4`;

    const themePromise = db.sequelize.query(themeQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    //custom 된 지역 게시글 모아오기
    const localQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                                FROM preview as P
                                INNER JOIN detail
                                LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id) 
                                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                                WHERE P.region =:region
                                GROUP BY P.Id ORDER BY favoriteCount DESC LIMIT 4`;

    const localPromise = db.sequelize.query(localQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, region: region },
      raw: true,
      nest: true,
    });

    const tempQuery = `SELECT p.theme, count(p.theme) AS num_theme
                        FROM preview AS p
                        JOIN savedPost AS s
                        WHERE s.PreviewId = p.Id
                        GROUP BY p.theme
                        ORDER BY num_theme DESC, p.theme ASC`;
    
    let maxThemeResult = await db.sequelize.query(tempQuery, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    });
    
    let maxTheme : string = maxThemeResult.length > 0 ? maxThemeResult[0]['theme'] : theme;
    maxTheme = mapping.reverseTheme[maxTheme];
    
    // 저장 게시물 중에서 가장 많이 저장된 태그
    const todayQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                        DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                        FROM preview as P
                        INNER JOIN detail 
                        LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                        LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                        WHERE detail.PostId=P.Id and detail.${maxTheme}= 1
                        GROUP BY P.Id ORDER BY favoriteCount DESC LIMIT 4`;

    const todayPromise = db.sequelize.query(todayQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    let main: mainDTO;

    await Promise.all([
      bannerPromise,
      initPromise,
      trendPromise,
      themePromise,
      localPromise,
      todayPromise,
    ])
      .then((result) => {
        let banner: bannerDTO[] = [];
        const bannerResult: any = result[0]; // banner

        for (let idx in bannerResult) {
          const tempBanner: bannerDTO = {
            bannerTitle: bannerResult[idx]['bannerTitle'],
            bannerImage: bannerResult[idx]['bannerImage'],
            bannerTag: bannerResult[idx]['bannerTag'],
          };
          banner.push(tempBanner);
        }

        // initialize MAIN
        main = {
          banner: banner,
          todayCharoDrive: makePreview(result[5]),
          trendDrive: makePreview(result[2]),
          customTitle: result[1][0]['customThemeTitle'],
          customDrive: makePreview(result[3]),
          localTitle: result[1][0]['localTitle'],
          localDrive: makePreview(result[4]),
        };
      })
      .catch((err) => {
        throw err;
      });

    return response.success(code.OK, msg.MAIN_SUCCESS, main);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}
