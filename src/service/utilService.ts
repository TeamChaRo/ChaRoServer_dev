import { db } from '../models';
import { QueryTypes, and } from 'sequelize';

import { followDTO } from '../interface/res/followDTO';
import { likesDTO } from '../interface/res/likesDTO';
import { modifyUserDTO } from '../interface/req/modifyUserDTO';

import s3 from '../loaders/s3';

import sendMQ from '../utils/sendMQ';
import { mqDTO } from '../interface/req/mqDTO';

import bcrypt from 'bcryptjs';

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

// 팔로잉/팔로워 리스트의 소유 유저(myPageEmail)
// 이를 볼 유저(userEmail)
export async function doGetFollow(myPageEmail: string, userEmail: string) {
  const getFollower = `SELECT A.email, A.nickname, A.profileImage, B.follower as isFollow
          FROM (SELECT follow.follower, follow.followed, user.email, user.nickname, user.profileImage FROM follow INNER JOIN user WHERE follow.followed =:myPageEmail AND user.email = follow.follower) as A
          LEFT OUTER JOIN follow as B on(B.follower =:userEmail and B.followed = A.follower)`;

  const followers = await db.sequelize.query(getFollower, {
    type: QueryTypes.SELECT,
    replacements: { userEmail: userEmail, myPageEmail: myPageEmail },
    nest: true,
    raw: true,
  });

  const getFollowing = `SELECT A.email, A.nickname, A.profileImage, B.followed as isFollow
  FROM (SELECT follow.follower, follow.followed, user.email, user.nickname, user.profileImage FROM follow INNER JOIN user WHERE follow.follower =:myPageEmail AND user.email = follow.followed) as A
  LEFT OUTER JOIN follow as B on(B.follower =:userEmail and B.followed = A.followed)`;

  const followings = await db.sequelize.query(getFollowing, {
    type: QueryTypes.SELECT,
    replacements: { userEmail: userEmail, myPageEmail: myPageEmail },
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
      is_follow: f['isFollow'] ? true : false,
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

    return {
      status: 200,
      data: {
        success: true,
        msg: '좋아요 리스트 조회~',
        data: likesList,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '좋아요 목록 불러오기 실패',
      },
    };
  }
}

export async function doDeleteUser(userEmail: string) {
  const result = await db.User.findOne({
    where: { email: userEmail },
    attributes: ['profileImage'],
    raw: true,
  }).catch((err) => {
    return {
      status: 500,
      data: {
        success: false,
        msg: 'DB Error',
      },
    };
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
          return {
            status: 500,
            data: {
              success: false,
              msg: 'S3 delete error',
            },
          };
        }
      }
    );
  }

  db.User.destroy({ where: { email: userEmail } });

  return {
    status: 200,
    data: {
      success: true,
      msg: '유저 회원 탈퇴 성공',
    },
  };
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
  } catch (err) {
    return {
      status: 500,
      data: {
        success: false,
        msg: '서버 에러입니당',
      },
    };
  }
  return {
    status: 200,
    data: {
      success: true,
      msg: '유저 프로필 수정 성공~~ 지.호.예 파이팅 야야야!',
    },
  };
}

export async function doCheckPassword(userEmail: string, password: string) {
  const user = await db.User.findOne({ where: { email: userEmail } });

  if (!user) {
    return {
      status: 404,
      data: {
        success: false,
        msg: '해당 유저가 없습니다.',
      },
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      status: 404,
      data: {
        success: false,
        msg: '비밀번호가 일치하지 않습니다.',
      },
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      msg: '올바른 비밀번호 입니다. 비밀번호 수정 API를 요청하시면 됩니다~',
    },
  };
}

export async function doModifyPassword(userEmail: string, newPassword: string) {
  const salt = await bcrypt.genSalt(10);
  const passwordSalt = await bcrypt.hash(newPassword, salt);

  db.User.update({ password: passwordSalt }, { where: { email: userEmail } });

  return {
    status: 200,
    data: {
      success: true,
      msg: '비밀번호 변경이 완료되었습니다!',
    },
  };
}
