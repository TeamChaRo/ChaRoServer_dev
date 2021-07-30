import express, { Request, Response } from 'express';

import { getDetail } from '../service/detailService';
import { getLikeTrend, getLikeTheme, getLikeLocal } from '../service/previewService';
// userId 검사는.... 따로 빼야되는데, 사실?! 실제로는 이상한 아이디가 들어올 수 없지 않나.

const readPost = async function readPost(req: Request, res: Response) {
  const { userId, postId } = req.params;
  console.log(userId, postId);

  const result = await getDetail(userId, postId);

  return res.status(result.status).json(result.data);
};

const readLikePreview = async function readPost(req: Request, res: Response) {
  const { userId, identifier } = req.params;
  const { value } = req.query;

  let result: any;

  if (identifier == '0') {
    result = await getLikeTrend(userId);
  } else if (identifier == '1') {
    result = await getLikeTheme(userId, value as string);
  } else if (identifier == '2') {
    result = await getLikeLocal(userId, value as string);
  } else if (identifier == '3') {
    // cumstom_theme 값 ( 관리자 권한 )
    result = await getLikeTheme(userId, 'river');
  }
  return res.status(result.status).json(result.data);
};
export default {
  readPost,
  readLikePreview,
};
