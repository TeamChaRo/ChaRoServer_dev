import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { makePreview } from './makePreview';

import { myPageUser, myPageDTO } from '../interface/res/myPageDTO';
import { write } from 'fs';

export async function getLikeMyPage(userEmail: string) {
  try {
    const writeQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PostId FROM detail WHERE userEmail=:userEmail) as D
                    INNER JOIN preview as P 
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE D.PostId = P.Id
                    GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const writePromise = db.sequelize.query(writeQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    const saveQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PreviewId FROM savedPost WHERE UserEmail=:userEmail) as S
                    INNER JOIN preview as P
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE S.PreviewId = P.Id
                    GROUP BY P.Id ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const savePromise = db.sequelize.query(saveQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    const userQuery = `SELECT nickname, profileImage
                        FROM user
                        WHERE email =:userEmail`;

    const userPromise = db.sequelize.query(userQuery, {
      replacements: { userEmail: userEmail },
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    const followingQuery = `SELECT count(A.follower) AS following, user.nickname AS nickname, user.profileImage AS profileImage
                                FROM user 
                                INNER JOIN follow AS A 
                                WHERE user.email= :userEmail AND user.email = A.followed`;
    const followPromise = db.sequelize.query(followingQuery, {
      replacements: { userEmail: userEmail },
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    const followerQuery = `SELECT count(B.followed) AS follower
                                FROM user 
                                INNER JOIN follow AS B
                                WHERE user.email= :userEmail AND user.email = B.follower`;
    const followerPromise = db.sequelize.query(followerQuery, {
      replacements: { userEmail: userEmail },
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    let myPage: myPageDTO;

    await Promise.all([
      writePromise,
      savePromise,
      followPromise,
      followerPromise,
      userPromise,
    ]).then((result) => {

      const writeData = makePreview(result[0]);

      for(let idx in writeData.drive){
        writeData.drive[idx]['favoriteNum'] = result[0][idx]['favoriteCount'];
        writeData.drive[idx]['saveNum'] = result[0][idx]['saveCount'];
      }

      const saveData = makePreview(result[1]);

      for(let idx in saveData.drive){
        saveData.drive[idx]['favoriteNum'] = result[1][idx]['favoriteCount'];
        saveData.drive[idx]['saveNum'] = result[1][idx]['saveCount'];
      }

      const follow = result[2][0];
      const follwer = result[3][0];
      const user = result[4][0];
      const userInfo: myPageUser = {
        nickname: user['nickname'],
        profileImage: user['profileImage'],
        following: follwer['follower'],
        follower: follow['following'],
      };

      myPage = {
        userInformation: userInfo,
        writtenPost: writeData,
        savedPost: saveData,
      };
    });
    return {
      status: 200,
      data: {
        success: true,
        msg: '8월 17일,, 새롭게 서버 연결할 생각하니 아찔하당... 무하하',
        data: myPage,
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

export async function getLikeMoreWriteMyPage(userEmail: string, postId: string, count: string) {
  try {
    const writeQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PostId FROM detail WHERE userEmail=:userEmail) as D
                    INNER JOIN preview as P 
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE D.PostId = P.Id
                    GROUP BY P.Id 
                    HAVING (count(countLike.PreviewId) = :count and P.Id < :postId) 
                    ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(writeQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, count: parseInt(count), postId: parseInt(postId) },
      raw: true,
      nest: true,
    });

    const writeData = makePreview(result);

    for (let temp of writeData.drive) {
      temp['favoriteNum'] = result[0]['favoriteCount'];
      temp['saveNum'] = result[0]['saveCount'];
    }
    return {
      status: 200,
      data: {
        success: true,
        msg: '마이페이지 작성/인기순 무한스크롤임다.',
        data: writeData,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '마이페이지 무한스크롤 실패',
      },
    };
  }
}

export async function getLikeMoreSaveMyPage(userEmail: string, postId: string, count: string) {
  try {
    const saveQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PreviewId FROM savedPost WHERE UserEmail=:userEmail) as S
                    INNER JOIN preview as P
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE S.PreviewId = P.Id
                    GROUP BY P.Id 
                    HAVING (count(countLike.PreviewId) = :count and P.Id < :postId) 
                    ORDER BY favoriteCount DESC, P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(saveQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, count: parseInt(count), postId: parseInt(postId) },
      raw: true,
      nest: true,
    });

    const saveData = makePreview(result);
    for (let temp of saveData.drive) {
      temp['favoriteNum'] = result[0]['favoriteCount'];
      temp['saveNum'] = result[0]['saveCount'];
    }

    return {
      status: 200,
      data: {
        success: true,
        msg: '마이페이지 저장/인기순 무한스크롤임다.',
        data: saveData,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '마이페이지 무한스크롤 실패',
      },
    };
  }
}

export async function getNewMyPage(userEmail: string) {
  try {
    const writeQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PostId FROM detail WHERE userEmail=:userEmail) as D
                    INNER JOIN preview as P 
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE D.PostId = P.Id
                    GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

    const writePromise = db.sequelize.query(writeQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    const saveQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PreviewId FROM savedPost WHERE UserEmail=:userEmail) as S
                    INNER JOIN preview as P
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE S.PreviewId = P.Id
                    GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

    const savePromise = db.sequelize.query(saveQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });

    const userQuery = `SELECT nickname, profileImage
                        FROM user
                        WHERE email =:userEmail`;

    const userPromise = db.sequelize.query(userQuery, {
      replacements: { userEmail: userEmail },
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    const followingQuery = `SELECT count(A.follower) AS following, user.nickname AS nickname, user.profileImage AS profileImage
                                FROM user 
                                INNER JOIN follow AS A 
                                WHERE user.email= :userEmail AND user.email = A.followed`;
    const followPromise = db.sequelize.query(followingQuery, {
      replacements: { userEmail: userEmail },
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    const followerQuery = `SELECT count(B.followed) AS follower
                                FROM user 
                                INNER JOIN follow AS B
                                WHERE user.email= :userEmail AND user.email = B.follower`;
    const followerPromise = db.sequelize.query(followerQuery, {
      replacements: { userEmail: userEmail },
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    let myPage: myPageDTO;

    await Promise.all([
      writePromise,
      savePromise,
      followPromise,
      followerPromise,
      userPromise,
    ]).then((result) => {
      const writeData = makePreview(result[0]);

      for (let temp of writeData.drive) {
        temp['favoriteNum'] = result[0][0]['favoriteCount'];
        temp['saveNum'] = result[0][0]['saveCount'];
      }

      const saveData = makePreview(result[1]);
      for (let temp of saveData.drive) {
        temp['favoriteNum'] = result[1][0]['favoriteCount'];
        temp['saveNum'] = result[1][0]['saveCount'];
      }

      // 팔로워 - 나를 팔로우 하는 사람들
      // 팔로잉 - 내가 팔로우 하는 것
      const follow = result[2][0];
      const follwer = result[3][0];
      const user = result[4][0];
      const userInfo: myPageUser = {
        nickname: user['nickname'],
        profileImage: user['profileImage'],
        following: follwer['follower'],
        follower: follow['following'],
      };

      myPage = {
        userInformation: userInfo,
        writtenPost: writeData,
        savedPost: saveData,
      };
    });
    return {
      status: 200,
      data: {
        success: true,
        msg: '마이페이지 최신순 조회입니다~ 우리집 개는 왜 귀여울까,,못생겼는데,,,',
        data: myPage,
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

export async function getNewMoreWriteMyPage(userEmail: string, postId: string) {
  try {
    const writeQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PostId FROM detail WHERE userEmail=:userEmail) as D
                    INNER JOIN preview as P 
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE D.PostId = P.Id
                    GROUP BY P.Id 
                    HAVING P.Id < :postId
                    ORDER BY P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(writeQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, postId: parseInt(postId) },
      raw: true,
      nest: true,
    });

    const writeData = makePreview(result);

    for (let temp of writeData.drive) {
      temp['favoriteNum'] = result[0]['favoriteCount'];
      temp['saveNum'] = result[0]['saveCount'];
    }

    return {
      status: 200,
      data: {
        success: true,
        msg: '마이페이지 최신순/작성 무한스크롤이용',
        data: writeData,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '마이페이지 무한스크롤 실패',
      },
    };
  }
}

export async function getNewMoreSaveMyPage(userEmail: string, postId: string) {
  try {
    const saveQuery = `SELECT P.Id, P.title, P.image, P.region, P.theme, P.warning, 
                    DATE_FORMAT(P.createdAt, '%Y-%m-%d') as date, count(countSave.PreviewId) as saveCount, count(countLike.PreviewId) as favoriteCount
                    FROM (SELECT PreviewId FROM savedPost WHERE UserEmail=:userEmail) as S
                    INNER JOIN preview as P
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.Id)
                    LEFT OUTER JOIN savedPost as countSave ON(countSave.PreviewId = P.Id)
                    WHERE S.PreviewId = P.Id
                    GROUP BY P.Id ORDER BY P.Id DESC LIMIT 10`;

    const result = await db.sequelize.query(saveQuery, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, postId: parseInt(postId) },
      raw: true,
      nest: true,
    });

    const saveData = makePreview(result);
    for (let temp of saveData.drive) {
      temp['favoriteNum'] = result[0]['favoriteCount'];
      temp['saveNum'] = result[0]['saveCount'];
    }

    return {
      status: 200,
      data: {
        success: true,
        msg: '마이페이지 최신순/저장 무한스크롤이용',
        data: saveData,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '마이페이지 무한스크롤 실패',
      },
    };
  }
}
