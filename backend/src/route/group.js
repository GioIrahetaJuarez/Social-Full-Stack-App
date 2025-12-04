import * as model from '../model/group.js';

/**
 * Get Groups for a user
 * @param {object} req too
 * @param {object} res no
 */
export async function getGroups(req, res) {
  const id = req.user.id;
  const groups = await model.findUserGroups(id);
  res.status(200).json(groups);
}
