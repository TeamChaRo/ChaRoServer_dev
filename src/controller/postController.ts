import express, { Request, Response } from 'express';

import { getDetail } from '../service/detailService';
import { getLikeTrend, getLikeTheme, getLikeLocal, getNewTrend } from '../service/previewService';
// userEmail 검사는.... 따로 빼야되는데, 사실?! 실제로는 이상한 아이디가 들어올 수 없지 않나.

const readPost = async function readPost(req: Request, res: Response) {
  const { userEmail, postId } = req.params;

  const result = await getDetail(userEmail, postId);

  return res.status(result.status).json(result.data);
};

const readLikePreview = async function readPost(req: Request, res: Response) {
  const { userEmail, identifier } = req.params;
  const { value } = req.query;

  let result: any;

  if (identifier == '0') {
    result = await getLikeTrend(userEmail);
  } else if (identifier == '1') {
    result = await getLikeTheme(userEmail, value as string);
  } else if (identifier == '2') {
    result = await getLikeLocal(userEmail, value as string);
  } else if (identifier == '3') {
    // cumstom_theme 값 ( 관리자 권한 )
    result = await getLikeTheme(userEmail, 'river');
  }
  return res.status(result.status).json(result.data);
};

const readNewPreview = async function readPost(req: Request, res: Response) {
  const { userEmail, identifier } = req.params;
  const { value } = req.query;

  let result: any;

  if (identifier == '0') {
    result = await getNewTrend(userEmail);
  } else if (identifier == '1') {
    result = await getLikeTheme(userEmail, value as string);
  } else if (identifier == '2') {
    result = await getLikeLocal(userEmail, value as string);
  } else if (identifier == '3') {
    // cumstom_theme 값 ( 관리자 권한 )
    result = await getLikeTheme(userEmail, 'river');
  }
  return res.status(result.status).json(result.data);
};

export default {
  readPost,
  readLikePreview,
  readNewPreview,
};
