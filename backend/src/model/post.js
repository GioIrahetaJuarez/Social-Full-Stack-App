import {pool} from './pool.js';

/**
 * Return posts
 * @param {string|null} groupId - UUID of the social group, or null
 * @returns {Array} an array of posts
 */
export async function findPosts(groupId) {
  const select = `
    SELECT
      post.id,
      post.data->>'img' as img,
      post.data->>'text' as text, 
      post.data->>'created' as created,
      post.data->'likes' as likes,
      creds.data->>'name' as author
    FROM post
    LEFT JOIN creds ON post.author = creds.id
    WHERE post.data->>'socialgroup' ${groupId == null ? 'IS NULL' : '= $1'}
  `;
  const query = {
    text: select,
    ...(groupId != null && {values: [groupId]}),
  };
  const {rows} = await pool.query(query);
  console.log(rows);
  return rows;
}

/**
 * Like post
 * @param {string} postId - UUID
 * @param {string} userId heerhh
 * @returns {object} r
 */
export async function putLike(postId, userId) {
  const select = {
    text: 'SELECT data FROM post WHERE id = $1',
    values: [postId],
  };

  const {rows} = await pool.query(select);

  // If not found
  // if (rows.length == 0) {
  //   return 404;
  // }

  const post = rows[0].data;

  // If already liked
  // if (post.likes && post.likes.includes(userId)) {
  // }

  const updatedLikes = [...post.likes, userId];
  post.likes = updatedLikes;

  // Update the post with new likes
  const updateQuery = {
    text: 'UPDATE post SET data = $1 WHERE id = $2 RETURNING *',
    values: [JSON.stringify(post), postId],
  };

  const result = await pool.query(updateQuery);
  return result.rows[0].data;
}
