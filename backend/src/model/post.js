import {pool} from './pool.js';

/**
 * Return posts
 * @param {string|null} groupId - UUID of the social group, or null
 * @returns {Array} an array of posts
 */
export async function findPosts(groupId) {
  const select = `
    SELECT
      post.data->>'img' as img,
      post.data->>'text' as text, 
      post.data->>'created' as created,
      creds.data->>'name' as author_name
    FROM post
    LEFT JOIN creds ON post.author = creds.id
    WHERE post.data->>'socialgroup' ${groupId == null ? 'IS NULL' : '= $1'}
  `;
  const query = {
    text: select,
    ...(groupId != null && {values: [groupId]}),
  };
  const {rows} = await pool.query(query);
  return rows;
}
