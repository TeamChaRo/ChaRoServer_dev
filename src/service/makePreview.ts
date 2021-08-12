import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { previewDTO } from '../interface/res/previewDTO';

export function makePreview(result: object[]): previewDTO[] {
  const preview: previewDTO[] = [];

  for (let data of result) {
    const dateToken = data['date'].split('-');

    const tempDrive: previewDTO = {
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

    preview.push(tempDrive);
  }
  return preview;
}
