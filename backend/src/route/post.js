import * as model from '../model/post.js';

/**
 * Get Posts
 * @param {object} req too
 * @param {object} res no
 */
export async function getPosts(req, res) {
  const groupId = req.query.groupId ?? null;
  const data = await model.findPosts(groupId);
  res.status(200).json(data);
}

/**
 * Put Like
 * @param {object} req too
 * @param {object} res no
 */
export async function putLike(req, res) {
  const postId = req.params.postId;
  const userId = req.user.id;
  await model.putLike(postId, userId);
  res.sendStatus(201);
}
