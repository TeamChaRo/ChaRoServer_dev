import { Request, Response } from 'express';

import { previewDTO, detailDTO } from '../interface/req/writePostDTO';

import { doWrite } from '../service/writeService';
import mapping from '../service/mapping.json';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

const writePost = async function (req: Request, res: Response) {
  // images path
  let imagesPath: string[] = [];
  if (req.files) {
    for (let file of req.files as Express.MulterS3.File[]) {
      imagesPath.push((file as Express.MulterS3.File).location);
    }
  }

  const {
    title,
    region,
    theme,
    warning,
    userEmail,
    province,
    isParking,
    parkingDesc,
    courseDesc,
    course,
  } = req.body;
  if (
    !userEmail ||
    !title ||
    !region ||
    !theme ||
    !warning ||
    !province ||
    !isParking ||
    !parkingDesc ||
    !courseDesc ||
    !course
  ) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const preview: previewDTO = {
    title: title,
    image: imagesPath[0],
    region: region,
    theme: typeof theme === 'string' ? mapping.theme[theme] : mapping.theme[theme[0]], //첫번쨰거 파싱
    warning: warning
      ? typeof warning === 'string'
        ? mapping.warning[warning]
        : mapping.theme[warning[0]]
      : '', // 첫번째거 파싱
  };

  const detail: detailDTO = {
    PostId: 0, //initial
    UserEmail: userEmail,
    province: province,
    isParking: isParking,
    parkingDesc: parkingDesc,
    courseDesc: courseDesc,

    src: course[0]['address'],
    srcLongitude: course[0]['longitude'],
    srcLatitude: course[0]['latitude'],

    wayPoint: course.length > 2 ? course[1]['address'] : '',
    wayLongitude: course.length > 2 ? course[1]['longitude'] : '',
    wayLatitude: course.length > 2 ? course[1]['latitude'] : '',

    dest: course[course.length - 1]['address'],
    destLongitude: course[course.length - 1]['longitude'],
    destLatitude: course[course.length - 1]['latitude'],

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

  if (typeof theme === 'string') {
    detail[theme] = true;
  } else {
    theme.forEach((value: string) => {
      detail[value] = true;
    });
  }

  if (typeof warning === 'string') {
    detail[warning] = true;
  } else {
    warning.forEach((value: string) => {
      detail[value] = true;
    });
  }

  const result = await doWrite(preview, detail);
  res.status(result.status).json(result.data);
};

export default {
  writePost,
};
