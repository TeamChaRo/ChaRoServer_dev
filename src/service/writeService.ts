import { db } from '../models';

import sendMQ from '../utils/sendMQ';
import { mqDTO } from '../interface/req/mqDTO';

import { previewDTO, detailDTO } from '../interface/req/writePostDTO';
export async function doWrite(preview: previewDTO, detail: detailDTO) {
  try {
    let PostId: number;
    await db.Preview.create(preview)
      .then((data) => (PostId = data['Id']))
      .catch((err) => {
        throw err;
      });

    detail.PostId = PostId;
    await db.Detail.create(detail).catch((err) => {
      throw err;
    });

    const pushData: mqDTO = {
      email: detail.UserEmail,
      token: detail.PostId.toString(),
    };

    sendMQ('follow', pushData);

    return {
      status: 200,
      data: {
        success: true,
        msg: '박익범 으로 삼행시 해보겠습니다. 박: 박박디라라 익:익범이는 범: 킹~',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '작성하기 실패',
      },
    };
  }
}
