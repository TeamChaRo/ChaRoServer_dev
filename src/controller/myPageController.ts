import { Request, Response } from 'express';
import {
  getLikeMyPage,
  getNewMyPage,
  getLikeMoreWriteMyPage,
  getLikeMoreSaveMyPage,
  getNewMoreWriteMyPage,
  getNewMoreSaveMyPage,
} from '../service/myPageService';
const myPageLike = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  const result = await getLikeMyPage(userEmail);
  res.status(result.status).json(result.data);
};

const myPageLikeMoreWrite = async function (req: Request, res: Response) {
  const { userEmail, postId, count } = req.params;

  const result = await getLikeMoreWriteMyPage(userEmail, postId, count);
  res.status(result.status).json(result.data);
};

const myPageLikeMoreSave = async function (req: Request, res: Response) {
  const { userEmail, postId, count } = req.params;

  const result = await getLikeMoreSaveMyPage(userEmail, postId, count);
  res.status(result.status).json(result.data);
};

const myPageNew = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  const result = await getNewMyPage(userEmail);
  res.status(result.status).json(result.data);
};

const myPageNewMoreWrite = async function (req: Request, res: Response) {
  const { userEmail, postId } = req.params;

  const result = await getNewMoreWriteMyPage(userEmail, postId);
  res.status(result.status).json(result.data);
};

const myPageNewMoreSave = async function (req: Request, res: Response) {
  const { userEmail, postId } = req.params;

  const result = await getNewMoreSaveMyPage(userEmail, postId);
  res.status(result.status).json(result.data);
};

export default {
  myPageLike,
  myPageNew,
  myPageLikeMoreWrite,
  myPageLikeMoreSave,
  myPageNewMoreWrite,
  myPageNewMoreSave,
};
