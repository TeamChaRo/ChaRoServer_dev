import express, { Request, Response } from 'express';

import { getDetail } from '../service/detailService';
import {
  getLikeTrend,
  getLikeTheme,
  getLikeLocal,
  getLikeMoreTrend,
  getLikeMoreTheme,
  getLikeMoreLocal,
  getNewTrend,
  getNewTheme,
  getNewLocal,
} from '../service/previewService';
import { getMain } from '../service/mainService';
// userEmail 검사는.... 따로 빼야되는데, 사실?! 실제로는 이상한 아이디가 들어올 수 없지 않나.

const readMain = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  // 임의 지정 theme, region
  const result = await getMain(userEmail, 'summer', '부산');

  return res.status(result.status).json(result.data);
};
const readPost = async function (req: Request, res: Response) {
  const { userEmail, postId } = req.params;

  const result = await getDetail(userEmail, postId);

  return res.status(result.status).json(result.data);
};

const readLikePreview = async function (req: Request, res: Response) {
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

const readNewPreview = async function (req: Request, res: Response) {
  const { userEmail, identifier } = req.params;
  const { value } = req.query;

  let result: any;

  if (identifier == '0') {
    result = await getNewTrend(userEmail);
  } else if (identifier == '1') {
    result = await getNewTheme(userEmail, value as string);
  } else if (identifier == '2') {
    result = await getNewLocal(userEmail, value as string);
  } else if (identifier == '3') {
    // cumstom_theme 값 ( 관리자 권한 )
    result = await getNewTheme(userEmail, 'river');
  }
  return res.status(result.status).json(result.data);
};

const readNewMorePreview = async function (req: Request, res: Response) {};

const readLikeMorePreview = async function (req: Request, res: Response) {
  const { userEmail, identifier, postId, count } = req.params;
  const { value } = req.query;

  let result: any;

  if (identifier == '0') {
    result = await getLikeMoreTrend(userEmail, postId, count);
  } else if (identifier == '1') {
    result = await getLikeMoreTheme(userEmail, value as string, postId, count);
  } else if (identifier == '2') {
    result = await getLikeMoreLocal(userEmail, value as string, postId, count);
  } else if (identifier == '3') {
    // cumstom_theme 값 ( 관리자 권한 ) <- 얘는 그냥 10개로 놔두자 ㅎ
    result = await getLikeTheme(userEmail, 'river');
  }
  return res.status(result.status).json(result.data);
};

export default {
  readMain,
  readPost,
  readLikePreview,
  readNewPreview,
  readLikeMorePreview,
  readNewMorePreview,
};
