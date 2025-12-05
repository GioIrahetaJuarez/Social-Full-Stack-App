import {test, expect} from 'vitest';
import {page, clickOn, typeIn} from '../setup';

test('HOME displays posts', async () => {
  await typeIn(page, 'input[name="username"]', 'diraheta@ucsc.edu');
  await typeIn(page, 'input[name="password"]', 'arealpassword');
  await clickOn(page, '::-p-text(Log in)');
  await page.waitForFunction(
      () => document.querySelectorAll('img').length === 3);
  const count = await page.$$eval('img', (imgs) => imgs.length);
  expect(count).toBe(3);
}, 20000);
