import {test, expect} from 'vitest';
import {page, clickOn, getText, typeIn} from '../setup';

const dilbertCredentials = {
  username: 'diraheta@ucsc.edu',
  password: 'arealpassword',
};

// Basic tests ----------------------------------------------------------

test('LOGIN rejects invalid user', async () => {
  await typeIn(page, 'input[name="username"]', 'johnpork');
  await typeIn(page, 'input[name="password"]', '67');
  await clickOn(page, '::-p-text(Log in)');
  const loginButton = await getText(page, '::-p-text(Log in)');
  expect(loginButton).toBeTruthy();
}, 20000);

test('LOGIN accepts valid user', async () => {
  await typeIn(page, 'input[name="username"]', dilbertCredentials.username);
  await typeIn(page, 'input[name="password"]', dilbertCredentials.password);
  await clickOn(page, '::-p-text(Log in)');
  const logoutButton = await getText(page, '::-p-text(Logout)');
  expect(logoutButton).toBeTruthy();
}, 20000);

test('LOGOUT user', async () => {
  await typeIn(page, 'input[name="username"]', dilbertCredentials.username);
  await typeIn(page, 'input[name="password"]', dilbertCredentials.password);
  await clickOn(page, '::-p-text(Log in)');
  await clickOn(page, '::-p-text(Logout)');
  const loginButton = await getText(page, '::-p-text(Log in)');
  expect(loginButton).toBeTruthy();
}, 20000);

// Security Tests --------------------------------------------------------

test('LOGIN prevents SQL injection attempts', async () => {
  const sqlInjections = [
    'admin\' OR \'1\'=\'1',
    'diraheta@ucsc.edu\'--',
    '\' OR 1=1--',
  ];

  for (const injection of sqlInjections) {
    await typeIn(page, 'input[name="username"]', injection);
    await typeIn(page, 'input[name="password"]', '123');
    await clickOn(page, '::-p-text(Log in)');

    const logoutText = await getText(page, '::-p-text(Logout)');
    expect(logoutText).toBeNull();
  }
}, 30000);

