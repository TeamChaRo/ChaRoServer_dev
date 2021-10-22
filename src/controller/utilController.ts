import { Request, Response } from 'express';
import {
  doLike,
  doSave,
  doFollow,
  doGetFollow,
  doGetLikes,
  doDeleteUser,
  doModifyUser,
  doCheckPassword,
  doModifyPassword,
} from '../service/utilService';

import { modifyUserDTO } from '../interface/req/modifyUserDTO';

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

const getFollowers = async function (req: Request, res: Response) {
  const { userEmail, myPageEmail } = req.query;

  const result = await doGetFollow(myPageEmail as string, userEmail as string);
  res.status(result.status).json(result.data);
};

const getLikes = async function (req: Request, res: Response) {
  const { postId } = req.params;
  const { userEmail } = req.query;

  const result = await doGetLikes(userEmail as string, postId);
  res.status(result.status).json(result.data);
};

const deleteUser = async function (req: Request, res: Response) {
  const { userEmail } = req.params;
  const result = await doDeleteUser(userEmail as string);
  res.status(result.status).json(result.data);
};

const modifyUser = async function (req: Request, res: Response) {
  let newImage: string = '';
  if (req.file) {
    newImage = (req.file as Express.MulterS3.File).location;
  }
  const { userEmail } = req.params;
  const { originImage, newNickname } = req.body;

  const data: modifyUserDTO = {
    originImage: originImage,
    newImage: newImage,
    nickname: newNickname,
  };

  const result = await doModifyUser(userEmail, data);
  res.status(result.status).json(result.data);
};

const checkPassword = async function (req: Request, res: Response) {
  const { userEmail, password } = req.query;
  const result = await doCheckPassword(userEmail as string, password as string);
  res.status(result.status).json(result.data);
};

const modifyPassword = async function (req: Request, res: Response) {
  const { userEmail, newPassword } = req.query;
  const result = await doModifyPassword(userEmail as string, newPassword as string);
  res.status(result.status).json(result.data);
};
export default {
  like,
  save,
  follow,
  getFollowers,
  getLikes,
  deleteUser,
  modifyUser,
  checkPassword,
  modifyPassword,
};
