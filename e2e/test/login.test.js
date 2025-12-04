import {test, expect} from 'vitest';
import {page, clickOn, getText, typeIn} from './setup';

test('LOGIN accepts valid user', async () => {
  await typeIn(page, 'input[name="username"]', 'diraheta@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'arealpassword');
  await clickOn(page, '::-p-text(Log in)');
  const label = await getText(page, '::-p-text(Logout)');
  expect(label).not.toBeNull;
}, 20000);

test('LOGIN rejects invalid user', async () => {
  await typeIn(page, 'input[name="username"]', 'johnpork');
  await typeIn(page, 'input[name="password"]', '67');
  await clickOn(page, '::-p-text(Log in)');
  const label = await getText(page, '::-p-text(Logout)');
  expect(label).toBeNull;
}, 20000);

test('LOGOUT user', async () => {
  await typeIn(page, 'input[name="username"]', 'diraheta@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'arealpassword');
  await clickOn(page, '::-p-text(Log in)');
  await clickOn(page, '::-p-text(Logout)');
  const label = await getText(page, '::-p-text(Logout)');
  expect(label).not.toBeNull;
}, 20000);
