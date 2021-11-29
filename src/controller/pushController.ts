import express, { Request, Response } from 'express';
import { doRead, doRemove, doUpdateFcm, doGetList } from '../service/pushService';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

const read = async function (req: Request, res: Response) {
  const { pushId } = req.body;

  if (!pushId) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }
  const result = await doRead(pushId);
  res.status(result.status).json(result.data);
};

const remove = async function (req: Request, res: Response) {
  const { pushId } = req.params;

  if (!pushId) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const result = await doRemove(parseInt(pushId));
  res.status(result.status).json(result.data);
};

const getList = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  if (!userEmail) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const result = await doGetList(userEmail);
  res.status(result.status).json(result.data);
};

const updateFcm = async function (req: Request, res: Response) {
  const { token, userEmail } = req.body;

  if (!token || !userEmail) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const result = await doUpdateFcm(token, userEmail);
  res.status(result.status).json(result.data);
};

export default {
  read,
  remove,
  getList,
  updateFcm,
};
