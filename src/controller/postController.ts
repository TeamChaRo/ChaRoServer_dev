import express, { Request, Response } from 'express';

import { getDetail } from '../service/detailService';
// userId 검사는.... 따로 빼야되는데, 사실?! 실제로는 이상한 아이디가 들어올 수 없지 않나.

const readPost = async function readPost(req: Request, res: Response) {
  console.log('welcome post');

  const { userId, postId } = req.params;
  console.log(userId, postId);

  const result = await getDetail(userId, postId);

  return res.status(result.status).json(result.data);
};

export default {
  readPost,
};
