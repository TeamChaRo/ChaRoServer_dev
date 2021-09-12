import { db } from '../models';
import { QueryTypes } from 'sequelize';

import sendMQ from '../utils/sendMQ';
import { mqDTO } from '../interface/req/mqDTO';

export async function doLike(userEmail: string, postId: string) {
  try {
    const query = 'SELECT * FROM likedPost WHERE UserEmail=:userEmail and PreviewId=:postId';
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, postId: postId },
      nest: true,
    });

    if (result.length) {
      const deleteLike = 'DELETE FROM likedPost WHERE UserEmail= :userEmail and PreviewId= :postId';
      db.sequelize.query(deleteLike, {
        type: QueryTypes.DELETE,
        replacements: { userEmail: userEmail, postId: postId },
        nest: true,
      });
    } else {
      const addLike = 'INSERT INTO likedPost(UserEmail, PreviewId) VALUES(:userEmail, :postId)';
      db.sequelize.query(addLike, {
        type: QueryTypes.INSERT,
        replacements: { userEmail: userEmail, postId: postId },
        nest: true,
      });

      const pushData: mqDTO = {
        email: userEmail,
        token: postId,
      };

      sendMQ('like', pushData);
    }

    return {
      status: 200,
      data: {
        success: true,
        msg: '으쌰으쌰 차로파이팅', //"successfully liking the post",
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '좋아요 디비 반영 실패',
      },
    };
  }
}

export async function doSave(userEmail: string, postId: string) {
  try {
    const query = 'SELECT * FROM savedPost WHERE UserEmail=:userEmail and PreviewId=:postId';
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, postId: postId },
      nest: true,
    });

    if (result.length) {
      const deleteLike = 'DELETE FROM savedPost WHERE UserEmail= :userEmail and PreviewId= :postId';
      db.sequelize.query(deleteLike, {
        type: QueryTypes.DELETE,
        replacements: { userEmail: userEmail, postId: postId },
        nest: true,
      });
    } else {
      const addLike = 'INSERT INTO savedPost(UserEmail, PreviewId) VALUES(:userEmail, :postId)';
      db.sequelize.query(addLike, {
        type: QueryTypes.INSERT,
        replacements: { userEmail: userEmail, postId: postId },
        nest: true,
      });
    }

    return {
      status: 200,
      data: {
        success: true,
        msg: '으쌰으쌰 차로파이팅', //"successfully liking the post",
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '좋아요 디비 반영 실패',
      },
    };
  }
}

export async function doFollow(follower: string, followed: string) {
  try {
    const query = 'SELECT * FROM follow WHERE follower=:follower and followed=:followed';
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { follower: follower, followed: followed },
      nest: true,
    });

    if (result.length) {
      const deleteFollow = 'DELETE FROM follow WHERE follower=:follower and followed=:followed';
      db.sequelize.query(deleteFollow, {
        type: QueryTypes.DELETE,
        replacements: { follower: follower, followed: followed },
        nest: true,
      });
    } else {
      const addFollow = 'INSERT INTO follow(follower, followed) VALUES(:follower, :followed)';
      db.sequelize.query(addFollow, {
        type: QueryTypes.INSERT,
        replacements: { follower: follower, followed: followed },
        nest: true,
      });

      const pushData: mqDTO = {
        email: follower,
        token: followed,
      };
      sendMQ('following', pushData);
    }

    return {
      status: 200,
      data: {
        success: true,
        msg: '서버작 서버작~',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '유저 팔로우 실패',
      },
    };
  }
}
