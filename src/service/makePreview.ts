import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { previewDTO, driveDTO } from '../interface/res/previewDTO';

export function makePreview(result: object[]): previewDTO {
  let drive: driveDTO[] = [];
  const preview: previewDTO = {
    drive: drive,
  };

  for (let data of result) {
    const dateToken = data['date'].split('-');

    const tempDrive: driveDTO = {
      postId: data['Id'],

      title: data['title'],
      image: data['image'],

      region: data['region'],
      theme: data['theme'],
      warning: data['warning'],

      year: dateToken[0],
      month: dateToken[1],
      day: dateToken[2],

      isFavorite: data['isFavorite'] > 0 ? true : false,
    };

    drive.push(tempDrive);
  }
  return preview;
}
