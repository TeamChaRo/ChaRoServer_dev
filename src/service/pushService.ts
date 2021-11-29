import { db } from '../models';
import pushDTO from '../interface/res/pushDTO';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

export async function doRead(pushId: number) {
  try {
    await db.Push.update({ isRead: true }, { where: { Id: pushId } }).catch((err) => {
      throw err;
    });

    return response.nsuccess(code.OK, msg.READ_PUSH_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doRemove(pushId: number) {
  try {
    await db.Push.destroy({ where: { Id: pushId } }).catch((err) => {
      throw err;
    });

    return response.nsuccess(code.OK, msg.DELETE_PUSH_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doGetList(userEmail: string) {
  try {
    const result = await db.Push.findAll({
      attributes: [
        'Id',
        'isRead',
        'pushCode',
        'image',
        'token',
        'title',
        'body',
        [db.Sequelize.fn('date_format', db.Sequelize.col('createdAt'), '%m-%d'), 'date'],
      ],
      where: { UserEmail: userEmail },
      raw: true,
      nest: true,
    }).catch((err) => {
      throw err;
    });

    const pushes: pushDTO[] = [];

    result.forEach((value) => {
      const date = (value['date'] as string).split('-');

      const entity: pushDTO = {
        push_id: value['Id'],
        push_code: value['pushCode'],

        is_read: value['isRead'],
        token: value['token'],
        image: value['image'],

        title: value['title'],
        body: value['body'],

        month: date[0],
        day: date[1],
      };

      pushes.push(entity);
    });

    return response.success(code.OK, msg.READ_PUSHES_SUCCESS, pushes);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}

export async function doUpdateFcm(token: string, userEmail: string) {
  try {
    await db.User.update({ fcmToken: token }, { where: { email: userEmail } }).catch((err) => {
      throw err;
    });

    return response.nsuccess(code.OK, msg.UPDATE_FCM_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}
