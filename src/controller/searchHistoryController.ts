import { Request, Response } from 'express';

import saveHistoryDTO from '../interface/req/searchHistory';
import { save, read } from '../service/searchHistoryService';

const saveHistory = async function (req: Request, res: Response) {
  const { userEmail, searchHistory } = req.body;
  const historyEntity: saveHistoryDTO[] = [];

  for (let idx in searchHistory) {
    const entity: saveHistoryDTO = {
      UserEmail: userEmail,
      title: searchHistory[idx].title,
      address: searchHistory[idx].address,
      latitude: searchHistory[idx].latitude,
      longitude: searchHistory[idx].longitude,
    };
    historyEntity.push(entity);
  }

  const result = await save(historyEntity);
  res.status(result.status).json(result.data);
};

const readHistory = async function (req: Request, res: Response) {
  const { userEmail } = req.params;

  const result = await read(userEmail);
  res.status(result.status).json(result.data);
};

export default {
  saveHistory,
  readHistory,
};
