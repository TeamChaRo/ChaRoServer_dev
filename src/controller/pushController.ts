import express, { Request, Response } from 'express';
import { doRead, doRemove, doUpdateFcm } from '../service/pushService';

const read = async function (req: Request, res: Response) {
  const { pushId } = req.body;

  const result = await doRead(pushId);
  res.status(result.status).json(result.data);
};

const remove = async function (req: Request, res: Response) {
  const { pushId } = req.params;

  const result = await doRemove(parseInt(pushId));
  res.status(result.status).json(result.data);
};

const updateFcm = async function (req: Request, res: Response) {
  const { token, userEmail } = req.body;

  const result = await doUpdateFcm(token, userEmail);
  res.status(result.status).json(result.data);
};

export default {
  read,
  remove,
  updateFcm,
};
