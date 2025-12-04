import jwt from 'jsonwebtoken';

/**
 * Check
 * @param {object} req what
 * @param {object} res the
 * @param {object} next hell
 */
export async function check(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.secret, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
};
