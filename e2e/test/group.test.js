import {test, expect} from 'vitest';
import {page, clickOn, typeIn, getText} from './setup';

// Group Testing diff for individual users --------------------------------
test('GROUPS displays individual groups for dilbert', async () => {
  await typeIn(page, 'input[name="username"]', 'diraheta@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'arealpassword');
  await clickOn(page, '::-p-text(Log in)');
  await clickOn(page, '[aria-label="groups"]');
  await clickOn(page, '::-p-text(People I like)');
  const post = await getText(page, '::-p-text(But do i like you?)');
  expect(post).not.toBeNull();
}, 20000);

test('GROUPS displays individual groups for dilbert 2', async () => {
  await typeIn(page, 'input[name="username"]', 'diraheta@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'arealpassword');
  await clickOn(page, '::-p-text(Log in)');
  await clickOn(page, '[aria-label="groups"]');
  await clickOn(page, '::-p-text(CSE186)');
  const post = await getText(page, '::-p-text(Time to learn kids)');
  expect(post).not.toBeNull();
}, 20000);

test('GROUPS displays individual groups for micah 1', async () => {
  await typeIn(page, 'input[name="username"]', 'mshmitt@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'waitimgoated');
  await clickOn(page, '::-p-text(Log in)');
  await clickOn(page, '[aria-label="groups"]');
  await clickOn(page, '::-p-text(People I like)');
  const post = await getText(page, '::-p-text(But do i like you?)');
  expect(post).not.toBeNull();
}, 20000);

test('GROUPS doesnt display group for micah 2', async () => {
  await typeIn(page, 'input[name="username"]', 'mshmitt@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'waitimgoated');
  await clickOn(page, '::-p-text(Log in)');
  await clickOn(page, '[aria-label="groups"]');
  const post = await getText(page, '::-p-text(CSE186)');
  expect(post).toBeNull();
}, 20000);
