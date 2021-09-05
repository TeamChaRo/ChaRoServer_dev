import { Request, Response } from 'express';
import { doLike, doSave, doFollow } from '../service/utilService';
const like = async function (req: Request, res: Response) {
  const { userEmail, postId } = req.body;

  const result = await doLike(userEmail, postId);
  res.status(result.status).json(result.data);
};

const save = async function (req: Request, res: Response) {
  const { userEmail, postId } = req.body;

  const result = await doSave(userEmail, postId);
  res.status(result.status).json(result.data);
};

const follow = async function (req: Request, res: Response) {
  // followed = 팔로우 당한 사람
  const { follower, followed } = req.body;

  const result = await doFollow(follower, followed);
  res.status(result.status).json(result.data);
};

export default {
  like,
  save,
  follow,
};
