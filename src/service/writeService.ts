import { db } from '../models';

import sendMQ from '../utils/sendMQ';
import { mqDTO } from '../interface/req/mqDTO';

import { previewDTO, detailDTO } from '../interface/req/writePostDTO';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

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

    return response.nsuccess(code.OK, msg.CREATE_POST_SUCCESS);
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }
}
