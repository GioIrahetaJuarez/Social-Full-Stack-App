import {test, expect} from 'vitest';
import {page, clickOn, getText, typeIn} from './setup';

const dilbertCredentials = {
  username: 'diraheta@ucsc.edu',
  password: 'arealpassword',
};

test('LOGIN accepts valid user', async () => {
  await typeIn(page, 'input[name="username"]', dilbertCredentials.username);
  await typeIn(page, 'input[name="password"]', dilbertCredentials.password);
  await clickOn(page, '::-p-text(Log in)');
  const logoutButton = await getText(page, '::-p-text(Logout)');
  expect(logoutButton).toBeTruthy();
}, 20000);

test('LOGIN rejects invalid user', async () => {
  await typeIn(page, 'input[name="username"]', 'johnpork');
  await typeIn(page, 'input[name="password"]', '67');
  await clickOn(page, '::-p-text(Log in)');
  const loginButton = await getText(page, '::-p-text(Log in)');
  expect(loginButton).toBeTruthy();
}, 20000);

test('LOGOUT user', async () => {
  await typeIn(page, 'input[name="username"]', 'diraheta@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'arealpassword');
  await clickOn(page, '::-p-text(Log in)');
  await clickOn(page, '::-p-text(Logout)');
  const loginButton = await getText(page, '::-p-text(Log in)');
  expect(loginButton).toBeTruthy();
}, 20000);
