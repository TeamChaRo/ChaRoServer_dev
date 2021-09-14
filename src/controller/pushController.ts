import express, { Request, Response } from 'express';
import { doRead, doRemove, doGetList } from '../service/pushService';

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

const getList = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  const result = await doGetList(userEmail);
  res.status(result.status).json(result.data);
};

export default {
  read,
  remove,
  getList,
};
