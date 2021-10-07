import { db } from '../models';
import { QueryTypes } from 'sequelize';

import s3 from '../loaders/s3';

export async function doDelete(postId: string, images: string[]) {
  try {
    let params = {
      Bucket: 'charo-release',
      Delete: { Objects: [] },
    };

    for (let image of images) {
      const key = image.split('amazonaws.com/')[1];
      params.Delete.Objects.push({ Key: key });
    }

    s3.deleteObjects(params, function (err, data) {
      if (err) {
        throw err;
      }
    });
    db.Preview.destroy({ where: { Id: postId } });
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      data: {
        success: false,
        msg: 'SERVER Error',
      },
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      msg: '삭제 성공!',
    },
  };
}
