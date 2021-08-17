import { Request, Response } from 'express';
import { getLikeMyPage, getNewMyPage } from '../service/myPageService';
const myPageLike = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  const result = await getLikeMyPage(userEmail);
  res.status(result.status).json(result.data);
};

const myPageNew = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  const result = await getNewMyPage(userEmail);
  res.status(result.status).json(result.data);
};
export default {
  myPageLike,
  myPageNew,
};
