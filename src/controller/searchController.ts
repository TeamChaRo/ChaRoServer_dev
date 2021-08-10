import { Request, Response } from 'express';
import { getLikeSearch, getNewSearch } from '../service/searchService';
import searchDTO from '../interface/req/searchDTO';

/*
[검색 옵션 parsing]
------------- 1개 -------------
- 0 : region 
- 1 : theme
- 2 : warning
------------- 2개 -------------
- 3 : region, theme
- 4 : region, warning
- 5 : theme, warning
------------- 3개 -------------
- 6 : region, theme, warning
*/

function parseOptions(region: string, theme: string, warning: string): number {
  // 1개
  if (region && !theme && !warning) return 0;
  if (!region && theme && !warning) return 1;
  if (!region && !theme && warning) return 2;

  // 2개
  if (region && theme && !warning) return 3;
  if (region && !theme && warning) return 4;
  if (!region && theme && warning) return 5;

  //3개
  if (region && theme && warning) return 6;
}

const searchLikePost = async function (req: Request, res: Response) {
  const { region, theme, warning, userEmail } = req.body;

  // 1개의 옵션 선택
  const option = parseOptions(region, theme, warning);

  console.log('option!', option);
  const search: searchDTO = {
    region: region,
    theme: theme,
    warning: warning,
    userEmail: userEmail,
  };
  const result = await getLikeSearch(option, search);

  res.status(result.status).json(result.data);
};

const searchNewPost = async function (req: Request, res: Response): number {
  const { region, theme, warning, userEmail } = req.body;

  // 1개의 옵션 선택
  const option = parseOptions(region, theme, warning);

  const search: searchDTO = {
    region: region,
    theme: theme,
    warning: warning,
    userEmail: userEmail,
  };
  const result = await getLikeSearch(option, search);

  res.status(result.status).json(result.data);
};

export default {
  searchLikePost,
  searchNewPost,
};
