import {pool} from './pool.js';

/**
 * Query to select posts for now
 * @param {string} userId uuid of individual
 * @returns {Array} an array of posts
 */
export async function findUserGroups(userId) {
  const select = `
    SELECT DISTINCT sg.id, sg.owner, sg.data->>'name' AS name
    FROM socialgroup sg
    LEFT JOIN memberingroup mg ON sg.id = mg.socialgroup
    WHERE sg.owner = $1 OR mg.member = $1
    `;
  const query = {
    text: select,
    values: [userId],
  };
  const {rows} = await pool.query(query);
  return rows;
}
