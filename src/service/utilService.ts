import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { followDTO } from '../interface/res/followDTO';

export async function doLike(userEmail: string, postId: string) {
  try {
    const query = 'SELECT * FROM likedPost WHERE UserEmail=:userEmail and PreviewId=:postId';
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail, postId: postId },
      nest: true,
    });

    if (result.length) {
      const deleteLike = 'DELETE FROM likePost WHERE UserEmail= :userEmail and PreviewId= :postId';
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

export async function doGetFollow(userEmail: string) {
  //나를 팔로우 하고 있는 목록 + 해당 유저를 내가 팔로우하고 있는가 까지 체크
  const getFollower = `SELECT A.email, A.nickname, A.profileImage, B.follower as isFollow
          FROM (SELECT follow.follower, follow.followed, user.email, user.nickname, user.profileImage FROM follow INNER JOIN user WHERE follow.followed =:userEmail AND user.email = follow.follower) as A
          LEFT OUTER JOIN follow as B on(B.follower = A.followed and B.followed = A.follower)`;

  const followers = await db.sequelize.query(getFollower, {
    type: QueryTypes.SELECT,
    replacements: { userEmail: userEmail },
    nest: true,
    raw: true,
  });

  const getFollowing = `SELECT user.email, user.nickname, user.profileImage
          FROM follow INNER JOIN user 
          WHERE follow.follower = :userEmail AND user.email = follow.followed`;

  const followings = await db.sequelize.query(getFollowing, {
    type: QueryTypes.SELECT,
    replacements: { userEmail: userEmail },
    nest: true,
    raw: true,
  });

  const follower: followDTO[] = [];
  const following: followDTO[] = [];

  for (let f of followers) {
    const entity: followDTO = {
      nickname: f['nickname'],
      userEmail: f['email'],
      image: f['profileImage'],
      is_follow: f['isFollow'] ? true : false,
    };

    follower.push(entity);
  }

  for (let f of followings) {
    const entity: followDTO = {
      nickname: f['nickname'],
      userEmail: f['email'],
      image: f['profileImage'],
      is_follow: true,
    };

    following.push(entity);
  }
  return {
    status: 200,
    data: {
      success: true,
      msg: '팔로워 리스트 조회~',
      data: {
        follower: follower,
        following: following,
      },
    },
  };
}
