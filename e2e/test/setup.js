import {beforeAll, afterAll, beforeEach, afterEach} from 'vitest';
import puppeteer from 'puppeteer';
import path from 'path';
import express from 'express';
import http from 'http';

import 'dotenv/config';
import backend from '../../backend/src/app.js';

export let frontend;
export let browser;
export let page;
let backendServer;

beforeAll(() => {
  backendServer = backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
      express()
          .use('/assets', express.static(
              path.join(__dirname, '..', '..', 'frontend', 'dist', 'assets')))
          .get('/', function(req, res) {
            res.sendFile('index.html',
                {root: path.join(__dirname, '..', '..', 'frontend', 'dist')});
          }),
  );
  frontend.listen(3000, () => {
    console.log('Frontend Running at http://localhost:3000');
  });
});

afterAll(async () => {
  backendServer.close();
  await frontend.close();
  setImmediate(function() {
    frontend.emit('close');
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  const childProcess = browser.process();
  if (childProcess) {
    await childProcess.kill(9);
  }
});

export const clickOn = async (p, selector) => {
  const clickable = await p.waitForSelector(selector);
  await clickable.click();
  clickable.dispose();
};

export const typeIn = async (p, selector, text) => {
  const input = await p.waitForSelector(selector);
  await input.type(text);
  input.dispose();
};

export const getText = async (p, selector) => {
  try {
    const element = await p.waitForSelector(selector, {timeout: 5000});
    const text = await element.evaluate((el) => el.textContent);
    element.dispose();
    return text;
  } catch {
    return null;
  }
};

// wait for change function with the help of Copilot
export const waitForTextChange = async (p, selector, initialText, timeout) => {
  const defaultTimeout = timeout || 5000;
  const startTime = Date.now();
  while (Date.now() - startTime < defaultTimeout) {
    const text = await getText(p, selector);
    if (text !== null && text !== initialText) {
      return text;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return await getText(p, selector);
};
