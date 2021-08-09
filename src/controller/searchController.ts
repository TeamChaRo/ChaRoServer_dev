import { Request, Response } from 'express';
import { getLikeSearch, getNewSearch } from '../service/searchService';
function parseOptions(region: string, theme: string, warning: string): number {
  return 0;
}
const searchLikePost = async function (req: Request, res: Response) {
  const { region, theme, warning } = req.body;

  // 1개의 옵션 선택
  const option = parseOptions(region, theme, warning);

  const result = await getLikeSearch(option);

  res.status(result.status).json(result.data);
};

const searchNewPost = async function (req: Request, res: Response): number {
  const { region, theme, warning } = req.body;

  // 1개의 옵션 선택
  const option = parseOptions(region, theme, warning);

  const result = await getLikeSearch(option);

  res.status(result.status).json(result.data);
};

export default {
  searchLikePost,
  searchNewPost,
};
