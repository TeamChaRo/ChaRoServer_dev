import { Request, Response } from 'express';

function parseOptions(region: string, theme: string, warning: string): Number {
  return 0;
}
const searchLikePost = async function (req: Request, res: Response) {
  const { region, theme, warning } = req.body;

  // 1개의 옵션 선택
  const option = parseOptions(region, theme, warning);

  res.status(200).json({ test: 'HI~' });
};

const searchNewPost = async function (req: Request, res: Response) {
  const { region, theme, warning } = req.body;

  // 1개의 옵션 선택
  const option = parseOptions(region, theme, warning);

  res.status(200).json({ test: 'HI~' });
};

export default {
  searchLikePost,
  searchNewPost,
};
