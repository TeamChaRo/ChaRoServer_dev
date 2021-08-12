import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { mainDTO, bannerDTO } from '../interface/res/mainDTO';
import { previewDTO, driveDTO } from '../interface/res/previewDTO';
import { makePreview } from './makePreview';

export async function getMain(userEmail: string, theme: string, region: string) {
  try {
    /*
    let banner: bannerDTO[] = [];
    let today: previewDTO[] = [];
    let trend: previewDTO[] = [];
    let custom: previewDTO[] = [];
    let local: previewDTO[] = [];

    const main: mainDTO = {
      banner: banner,
      todayCharoDrive: today,
      trendDrive: trend,
      customTitle: '',
      customDrive: custom,
      localTitle: '',
      localDrive: local,
    };
*/
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

    const todayQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                                DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(isLike.PreviewId) as isFavorite, count(countLike.PreviewId) as favoriteCount
                                FROM preview as P
                                INNER JOIN detail
                                LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id) 
                                LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.Id and isLike.UserEmail =:userEmail)
                                WHERE P.region =:region
                                GROUP BY P.Id ORDER BY favoriteCount DESC LIMIT 4`;

    const todayPromise = db.sequelize.query(todayQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, region: region },
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
    ]).then((result) => {
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
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '오늘은 8월 10일 요 새로운 서버는 연결을 언제하자하는게 좋을까? 눈난뇨',
        data: main,
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
