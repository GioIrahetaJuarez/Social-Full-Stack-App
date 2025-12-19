import {test, expect} from 'vitest';
import {page, clickOn, getText, typeIn, waitForTextChange} from '../setup';

// Helper
const dilbertCredentials = {
  username: 'diraheta@ucsc.edu',
  password: 'arealpassword',
};

const micahCredentials = {
  username: 'mshmitt@ucsc.edu',
  password: 'waitimgoated',
};

/**
 * Login automation
 * @param {object} credentials creds
 */
async function login(credentials) {
  await typeIn(page, 'input[name="username"]', credentials.username);
  await typeIn(page, 'input[name="password"]', credentials.password);
  await clickOn(page, '::-p-text(Log in)');
}
// Basic tests ----------------------------------------------------------

test('LIKES load on startup', async () => {
  await login(dilbertCredentials);
  const likeCount = await getText(page,
      '[aria-label="post"]:first-of-type [aria-label="likecount"]');
  expect(likeCount).toBe('0');
}, 20000);

test('LIKES update on click', async () => {
  await login(dilbertCredentials);
  await clickOn(page,
      '[aria-label="post"]:first-of-type [aria-label="Like"]');
  const likeCount = await waitForTextChange(page,
      '[aria-label="post"]:first-of-type [aria-label="likecount"]', '0');
  expect(likeCount).toBe('1');
}, 20000);

test('LIKES shared across users', async () => {
  await login(micahCredentials);
  const likeCount = await waitForTextChange(page,
      '[aria-label="post"]:first-of-type [aria-label="likecount"]', '0');
  expect(likeCount).toBe('1');
}, 20000);
