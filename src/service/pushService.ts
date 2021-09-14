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

export async function doRemove(pushId: number) {
  try {
    await db.Push.destroy({ where: { Id: pushId } }).catch((err) => {
      throw err;
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '삭제했다 삭제했어~ 야야야,, 지금 뭐해,,, 심심하면 나한테 연락 한번 혀,,',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: 'push - 삭제 실패',
      },
    };
  }
}

export async function doGetList(userEmail: string) {
  try {
    return {
      status: 200,
      data: {
        success: true,
        msg: '암 투웨니 쓰리,, 난 수수껙끼,, question,,,? 모게요 맞춰봐용,,,',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: 'push - 목록 가져오기 실패',
      },
    };
  }
}
