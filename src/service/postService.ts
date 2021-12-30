import { db } from '../models';

import s3 from '../loaders/s3';

import { previewDTO, detailDTO } from '../interface/req/writePostDTO';

import response from '../constants/response';
import msg from '../constants/responseMessage';
import code from '../constants/statusCode';

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
    if(images) deleteImages(images);
    db.Preview.destroy({ where: { Id: postId } });
  } catch (err) {
    console.log(err);
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }

  return response.nsuccess(code.OK, msg.DELETE_POST_SUCCESS);
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
    return response.fail(code.INTERNAL_SERVER_ERROR, msg.SERVER_ERROR);
  }

  return response.nsuccess(code.OK, msg.MODIFY_POST_SUCCESS);
}
