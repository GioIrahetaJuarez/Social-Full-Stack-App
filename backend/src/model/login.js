import {pool} from './pool.js';

/**
 * Query to select credentials
 * @param {object} creds credentials
 * @returns {object} the id string me thinks
 */
export async function findCredentials(creds) {
  const select = `
        SELECT *
        FROM creds
        WHERE data ->> 'username' = $1
        AND data ->> 'password' = crypt($2, data ->> 'password')
    `;
  const query = {
    text: select,
    values: [creds.username, creds.password],
  };
  const {rows} = await pool.query(query);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}
