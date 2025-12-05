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
 * Get singular post
 * @param {object} req too
 * @param {object} res no
 * @returns {object} help me
 */
export async function getPost(req, res) {
  const postId = req.params.postId;
  const userId = req.user.id;
  const post = await model.findPost(postId);
  // Exists?
  if (!post) {
    return res.status(404).send();
  }

  // Check privacy?
  const hasAccess = await model.accessPost(postId, userId);
  if (!hasAccess) {
    return res.status(403).send();
  }

  res.status(200).json(post);
}

/**
 * Put Like
 * @param {object} req too
 * @param {object} res no
 * @returns {object} help me
 */
export async function putLike(req, res) {
  const postId = req.params.postId;
  const userId = req.user.id;

  // Check existense of post
  const found = await model.findPost(postId);
  if (!found) {
    return res.status(404).send();
  }

  // // Check privacy of post
  const hasAccess = await model.accessPost(postId, userId);
  if (!hasAccess) {
    return res.status(403).send();
  }

  // Perform like
  const post = await model.putLike(postId, userId);
  return res.status(201).json(post.likes);
}
