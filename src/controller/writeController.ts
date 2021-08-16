import { Request, Response } from 'express';

import { previewDTO, detailDTO } from '../interface/req/writePostDTO';

import { doWrite } from '../service/writeService';
import mapping from '../service/mapping.json';

const writePost = async function (req: Request, res: Response) {
  // images path
  let imagesPath: string[] = [];
  if (req.files) {
    for (let file of req.files as Express.MulterS3.File[])
      imagesPath.push((file as Express.MulterS3.File).location);
  }

  const preview: previewDTO = {
    title: req.body.title,
    image: imagesPath[0],
    region: req.body.region,
    theme: mapping.theme[req.body.theme[0]], //첫번쨰거 파싱
    warning: req.body.warning ? mapping.warning[req.body.warning[0]] : '', // 첫번째거 파싱
  };

  const detail: detailDTO = {
    PostId: 0, //initial
    province: req.body.province,
    isParking: req.body.isParking,
    parkingDesc: req.body.parkingDesc,
    courseDesc: req.body.courseDesc,

    src: req.body.course[0]['address'],
    srcLongitude: req.body.course[0]['longitude'],
    srcLatitude: req.body.course[0]['latitude'],

    wayOne: req.body.course.length > 2 ? req.body.course[1]['address'] : '',
    wayOneLongitude: req.body.course.length > 2 ? req.body.course[1]['longitude'] : '',
    wayOneLatitude: req.body.course.length > 2 ? req.body.course[1]['latitude'] : '',

    wayTwo: req.body.course.length > 3 ? req.body.course[2]['address'] : '',
    wayTwoLongitude: req.body.course.length > 3 ? req.body.course[2]['longitude'] : '',
    wayTwoLatitude: req.body.course.length > 3 ? req.body.course[2]['latitude'] : '',

    dest: req.body.course[req.body.course.length - 1]['address'],
    destLongitude: req.body.course[req.body.course.length - 1]['longitude'],
    destLatitude: req.body.course[req.body.course.length - 1]['latitude'],

    image1: imagesPath.length > 1 ? imagesPath[1] : '',
    image2: imagesPath.length > 2 ? imagesPath[2] : '',
    image3: imagesPath.length > 3 ? imagesPath[3] : '',
    image4: imagesPath.length > 4 ? imagesPath[4] : '',
    image5: imagesPath.length > 5 ? imagesPath[5] : '',

    spring: false,
    summer: false,
    fall: false,
    winter: false,
    mountain: false,
    sea: false,
    lake: false,
    river: false,
    oceanRoad: false,
    blossom: false,
    maple: false,
    relax: false,
    speed: false,
    nightView: false,
    cityView: false,

    highway: false,
    mountainRoad: false,
    diffRoad: false,
    hotPlace: false,
  };

  req.body.theme.forEach((value: string) => {
    detail[value] = true;
  });

  req.body.warning.forEach((value: string) => {
    detail[value] = true;
  });

  const result = await doWrite(preview, detail);
  res.status(result.status).json(result.data);
};

export default {
  writePost,
};