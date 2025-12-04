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
    /*
     * Use these two settings instead of the one above if you want to see the
     * browser. However, in the grading system e2e test run headless, so make
     * sure they work that way before submitting.
     */
    // headless: false,
    // slowMo: 100,
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
    const element = await p.waitForSelector(selector, {timeout: 2000});
    const text = await element.evaluate((el) => el.textContent);
    element.dispose();
    return text;
  } catch {
    return null;
  }
};
