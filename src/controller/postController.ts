import express, { Request, Response } from 'express';

import { previewDTO, detailDTO } from '../interface/req/writePostDTO';
import mapping from '../service/mapping.json';

import { doDelete, getImages, doModifyPost } from '../service/postService';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { images } = req.body;

  if (!postId || !images) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }
  const result = await doDelete(postId, images);
  return res.status(result.status).json(result.data);
};

const modifyPost = async (req: Request, res: Response) => {
  const postId = req.body.postId;
  const deleted = req.body.deleted;

  if (!postId) {
    const result = response.fail(code.BAD_REQUEST, msg.NULL_VALUE);
    return res.status(result.status).json(result.data);
  }

  const images: string[] = await getImages(postId);

  for (let value of deleted) {
    // 디비에서 불러온 이미지 기록들 삭제
    const index = images.indexOf(value);
    images.splice(index, 1);
  }

  if (req.files) {
    for (let file of req.files as Express.MulterS3.File[])
      images.push((file as Express.MulterS3.File).location);
  }

  const preview: previewDTO = {
    title: req.body.title,
    image: images[0],
    region: req.body.region,
    theme:
      typeof req.body.theme === 'string'
        ? mapping.theme[req.body.theme]
        : mapping.theme[req.body.theme[0]], //첫번쨰거 파싱
    warning: req.body.warning
      ? typeof req.body.warning === 'string'
        ? mapping.warning[req.body.warning]
        : mapping.theme[req.body.warning[0]]
      : '', // 첫번째거 파싱
  };

  const detail: detailDTO = {
    PostId: postId, //initial
    UserEmail: req.body.userEmail,
    province: req.body.province,
    isParking: req.body.isParking,
    parkingDesc: req.body.parkingDesc,
    courseDesc: req.body.courseDesc,

    src: req.body.course[0]['address'],
    srcLongitude: req.body.course[0]['longitude'],
    srcLatitude: req.body.course[0]['latitude'],

    wayPoint: req.body.course.length > 2 ? req.body.course[1]['address'] : '',
    wayLongitude: req.body.course.length > 2 ? req.body.course[1]['longitude'] : '',
    wayLatitude: req.body.course.length > 2 ? req.body.course[1]['latitude'] : '',

    dest: req.body.course[req.body.course.length - 1]['address'],
    destLongitude: req.body.course[req.body.course.length - 1]['longitude'],
    destLatitude: req.body.course[req.body.course.length - 1]['latitude'],

    image1: images.length > 1 ? images[1] : '',
    image2: images.length > 2 ? images[2] : '',
    image3: images.length > 3 ? images[3] : '',
    image4: images.length > 4 ? images[4] : '',
    image5: images.length > 5 ? images[5] : '',

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

  if (typeof req.body.theme === 'string') {
    detail[req.body.theme] = true;
  } else {
    req.body.theme.forEach((value: string) => {
      detail[value] = true;
    });
  }

  if (typeof req.body.warning === 'string') {
    detail[req.body.warning] = true;
  } else {
    req.body.warning.forEach((value: string) => {
      detail[value] = true;
    });
  }
  const result = await doModifyPost(preview, detail, postId, images);
  return res.status(result.status).json(result.data);
};
export default {
  deletePost,
  modifyPost,
};
