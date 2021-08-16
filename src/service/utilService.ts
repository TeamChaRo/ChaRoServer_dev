import { db } from '../models';
import { QueryTypes } from 'sequelize';

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
