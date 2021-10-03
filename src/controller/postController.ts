import express, { Request, Response } from 'express';

import { doDelete } from '../service/postService';
const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const result = await doDelete(postId);
  return res.status(result.status).json(result.data);
};

export default {
  deletePost,
};
