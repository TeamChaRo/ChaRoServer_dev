import { db } from '../models';

export async function doRead(pushId: number) {
  try {
    await db.Push.update({ isRead: true }, { where: { Id: pushId } }).catch((err) => {
      throw err;
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '읽었다 읽었다 야야야,, ',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: 'push - 읽음 처리 실패',
      },
    };
  }
}
