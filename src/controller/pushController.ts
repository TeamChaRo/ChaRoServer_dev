import express, { Request, Response } from 'express';
import { doRead } from '../service/pushService';

const read = async function (req: Request, res: Response) {
  const { pushId } = req.body;

  const result = await doRead(pushId);
  res.status(result.status).json(result.data);
};

export default {
  read,
};
