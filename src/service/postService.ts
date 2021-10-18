import { db } from '../models';
import { QueryTypes } from 'sequelize';

import s3 from '../loaders/s3';

import { previewDTO, detailDTO } from '../interface/req/writePostDTO';

function deleteImages(images: string[]) {
  let params = {
    Bucket: 'charo-release',
    Delete: { Objects: [] },
  };

  for (let image of images) {
    const key = image.split('amazonaws.com/')[1];
    params.Delete.Objects.push({ Key: key });
  }

  s3.deleteObjects(params, function (err, data) {
    if (err) {
      throw err;
    }
  });
}
export async function doDelete(postId: string, images: string[]) {
  try {
    deleteImages(images);
    db.Preview.destroy({ where: { Id: postId } });
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      data: {
        success: false,
        msg: 'SERVER Error',
      },
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      msg: '삭제 성공!',
    },
  };
}

export async function getImages(postId: string) {
  const result = await db.Preview.findOne({
    include: [{ model: db.Detail, attributes: ['image1', 'image2', 'image3', 'image4', 'image5'] }],
    where: { Id: postId },
    attributes: ['image'],
    raw: true,
    nest: true,
  });

  const image = result['image'];
  const details = result['Detail'];

  const images: string[] = [];
  images.push(image);

  const standard = 'image';
  for (let i = 1; i <= 5; i++) {
    const key = standard + i.toString();

    if (details[key]) images.push(details[key]);
  }

  return images;
}

export async function doModifyPost(
  preview: previewDTO,
  detail: detailDTO,
  postId: string,
  images: string[]
) {
  try {
    deleteImages(images);
    db.Preview.update(preview, { where: { Id: postId } });
    db.Detail.update(detail, { where: { PostId: postId } });
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      data: {
        success: false,
        msg: '서버 에러 - 게시글 수정 실패',
      },
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      msg: '게시글 수정 완뇨~~~~~~ >,<',
    },
  };
}
