import express, { Request, Response } from 'express';

import { doDelete } from '../service/postService';
const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { images } = req.body;
  const result = await doDelete(postId, images);
  return res.status(result.status).json(result.data);
};

export default {
  deletePost,
};
