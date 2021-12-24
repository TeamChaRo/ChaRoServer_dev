import { db } from '../models';
import { QueryTypes, and } from 'sequelize';

import { followDTO } from '../interface/res/followDTO';
import { likesDTO } from '../interface/res/likesDTO';
import { modifyUserDTO } from '../interface/req/modifyUserDTO';
import { isFollowDTO } from '../interface/res/isFollowDTO';

import s3 from '../loaders/s3';

import sendMQ from '../utils/sendMQ';
import { mqDTO } from '../interface/req/mqDTO';

import bcrypt from 'bcryptjs';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

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

    return response.nsuccess(code.OK, msg.LIKE_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
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

    return response.nsuccess(code.OK, msg.SAVE_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doFollow(follower: string, followed: string) {
  try {

    let isFollow:boolean;

    const query = 'SELECT * FROM follow WHERE follower=:follower and followed=:followed';
    const result = await db.sequelize
      .query(query, {
        type: QueryTypes.SELECT,
        replacements: { follower: follower, followed: followed },
        nest: true,
      })
      .catch((err) => {
        throw err;
      });

    if (result.length) {
      isFollow = false;
      const deleteFollow = 'DELETE FROM follow WHERE follower=:follower and followed=:followed';
      db.sequelize
        .query(deleteFollow, {
          type: QueryTypes.DELETE,
          replacements: { follower: follower, followed: followed },
          nest: true,
        })
        .catch((err) => {
          throw err;
        });
    } else {
      isFollow = true;
      const addFollow = 'INSERT INTO follow(follower, followed) VALUES(:follower, :followed)';
      db.sequelize
        .query(addFollow, {
          type: QueryTypes.INSERT,
          replacements: { follower: follower, followed: followed },
          nest: true,
        })
        .catch((err) => {
          throw err;
        });

      const pushData: mqDTO = {
        email: follower,
        token: followed,
      };
      sendMQ('following', pushData);
    }

    const isFollowData: isFollowDTO = {
      isFollow
    }

    return response.success(code.OK, msg.FOLLOW_SUCCESS, isFollowData);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doGetIsFollow(targetEmail: string, userEmail: string) {
  const getIsFollowing = `SELECT F.followed
                          FROM follow as F
                          WHERE F.followed=:userEmail and F.follower=:targetEmail`;
  
  try{

    let isFollow:boolean;

    const result = await db.sequelize
      .query(getIsFollowing, {
        type: QueryTypes.SELECT,
        replacements: { targetEmail: targetEmail, userEmail: userEmail },
        nest: true,
      })
      .catch((err) => {
        throw err;
      });

    if (result.length) isFollow = true;
    else isFollow = false;

    const data: isFollowDTO = {
      isFollow
    }

    return response.success(code.OK, msg.GET_IS_FOLLOW_SUCCESS, data);
  }catch(err){
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}
// 팔로잉/팔로워 리스트의 소유 유저(myPageEmail)
// 이를 볼 유저(userEmail)
export async function doGetFollow(myPageEmail: string, userEmail: string) {
  try {

    // 팔로잉 = 내가 팔로우 한 사람들
    const getFollowing = `SELECT A.email, A.nickname, A.profileImage, B.follower as isFollow
                          FROM (SELECT follow.follower, follow.followed, user.email, user.nickname, user.profileImage FROM follow INNER JOIN user WHERE follow.followed =:myPageEmail AND user.email = follow.follower) as A
                          LEFT OUTER JOIN follow as B on(B.followed =:userEmail and B.follower = A.follower)`;

    // 팔로워 - 나를 팔로우 한 사람들                   
    const getFollower = `SELECT A.email, A.nickname, A.profileImage, B.followed as isFollow
                          FROM (SELECT follow.follower, follow.followed, user.email, user.nickname, user.profileImage FROM follow INNER JOIN user WHERE follow.follower =:myPageEmail AND user.email = follow.followed) as A
                          LEFT OUTER JOIN follow as B on(B.followed =:userEmail and B.follower = A.follower)`;

    const followers = await db.sequelize
      .query(getFollower, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: userEmail, myPageEmail: myPageEmail },
        nest: true,
        raw: true,
      })
      .catch((err) => {
        throw err;
      });

    const followings = await db.sequelize
      .query(getFollowing, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: userEmail, myPageEmail: myPageEmail },
        nest: true,
        raw: true,
      })
      .catch((err) => {
        throw err;
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
        is_follow: f['isFollow'] ? true : false,
      };

      following.push(entity);

      

    }
    const data = {
      follower,
      following,
    };
    
    return response.success(code.OK, msg.FOLLOW_LIST_SUCCESS, data);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doGetLikes(userEmail: string, postId: string) {
  try {
    // 해당 포스트 아이디의 좋아요한사람들
    // LEFT OUTER JOIN = 그 사람들을 userEmail이 follow하고 있는가?
    const getLikes = `SELECT user.email, user.nickname, user.profileImage, B.follower as isFollow
          FROM likedPost as A INNER JOIN user
          LEFT OUTER JOIN follow as B on(B.followed = user.email and B.follower = :userEmail)
          WHERE A.PreviewId = 1 and A.UserEmail = user.email`;

    const likes = await db.sequelize
      .query(getLikes, {
        type: QueryTypes.SELECT,
        replacements: { userEmail: userEmail },
        nest: true,
        raw: true,
      })
      .catch((err) => {
        throw err;
      });

    const likesList: likesDTO[] = [];

    for (let like of likes) {
      const entity: followDTO = {
        nickname: like['nickname'],
        userEmail: like['email'],
        image: like['profileImage'],
        is_follow: like['isFollow'] ? true : false,
      };

      likesList.push(entity);
    }

    return response.success(code.OK, msg.LIKE_LIST_SUCCESS, likesList);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doDeleteUser(userEmail: string) {
  try {
    const result = await db.User.findOne({
      where: { email: userEmail },
      attributes: ['profileImage'],
      raw: true,
    }).catch((err) => {
      throw err;
    });

    const imagePath: string = result['profileImage'];
    if (imagePath.includes('default') == false) {
      const key = imagePath.split('amazonaws.com/')[1];
      s3.deleteObject(
        {
          Bucket: 'charo-image',
          Key: key,
        },
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }

    db.User.destroy({ where: { email: userEmail } });
    return response.nsuccess(code.OK, msg.DELETE_POST_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doModifyUser(userEmail: string, data: modifyUserDTO) {
  try {
    if (data.newImage) {
      if (data.nickname) {
        // 둘다 존재
        db.User.update(
          { profileImage: data.newImage, nickname: data.nickname },
          { where: { email: userEmail } }
        );
      } else {
        // 이미지만 존재
        db.User.update({ profileImage: data.newImage }, { where: { email: userEmail } });
      }

      // 기존 이미지(originImage) 삭제
      if (data.originImage.includes('default') == false) {
        const key = data.originImage.split('amazonaws.com/')[1];
        s3.deleteObject(
          {
            Bucket: 'charo-image',
            Key: key,
          },
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      }
    } else {
      // 닉네임만 변경
      db.User.update({ nickname: data.nickname }, { where: { email: userEmail } });
    }
    return response.nsuccess(code.OK, msg.MODIFY_USER_SUCCESS);
  } catch (err) {
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doCheckPassword(userEmail: string, password: string) {
  const user = await db.User.findOne({ where: { email: userEmail } });

  if (!user) {
    return response.fail(code.NOT_FOUND, msg.NO_USER);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return response.fail(code.NOT_FOUND, msg.UNVALID_PASSWORD);
  }
  return response.nsuccess(code.OK, msg.VALID_PASSWORD);
}

export async function doModifyPassword(userEmail: string, newPassword: string) {
  const salt = await bcrypt.genSalt(10);
  const passwordSalt = await bcrypt.hash(newPassword, salt);

  db.User.update({ password: passwordSalt }, { where: { email: userEmail } });

  return response.nsuccess(code.OK, msg.MODIFY_PASSWORD_SUCCESS);
}
