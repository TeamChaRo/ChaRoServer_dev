import { db } from '../models';
import { QueryTypes } from 'sequelize';

export async function doDelete(postId: string) {
  db.Preview.destroy({ where: { Id: postId } });

  return {
    status: 200,
    data: {
      success: true,
      msg: '삭제 성공!',
    },
  };
}
