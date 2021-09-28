import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { driveDTO, previewDTO } from '../interface/res/previewDTO';

export function makePreview(result: object[]): previewDTO {
  const drive: driveDTO[] = [];
  const preview: previewDTO = {
    lastId: 0,
    lastCount: 0,
    drive: drive,
  };

  for (let idx in result) {
    if (parseInt(idx) == result.length - 1) {
      preview.lastId = result[idx]['Id'];
      preview.lastCount = result[idx]['favoriteCount'] ? result[idx]['favoriteCount'] : 0;
    }
    const dateToken = result[idx]['date'].split('-');

    const tempDrive: driveDTO = {
      postId: result[idx]['Id'],

      title: result[idx]['title'],
      image: result[idx]['image'],

      region: result[idx]['region'],
      theme: result[idx]['theme'],
      warning: result[idx]['warning'] ? result[idx]['warning'] : '',

      year: dateToken[0],
      month: dateToken[1],
      day: dateToken[2],

      isFavorite: result[idx]['isFavorite'] > 0 ? true : false,
    };

    drive.push(tempDrive);
  }
  return preview;
}
