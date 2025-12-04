import * as model from '../model/login.js';
import jwt from 'jsonwebtoken';
/**
 * Verify credential existense
 * @param {object} req request from user
 * @param {object} res response from user
 */
export async function findCredentials(req, res) {
  const credentials = req.body;
  const user = await model.findCredentials(credentials);
  if (user) {
    const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.secret, {
          expiresIn: '30m',
          algorithm: 'HS256',
        });
    res.status(200).json({
      name: credentials.username,
      accessToken: accessToken});
  } else {
    res.status(401).send();
  }
}

