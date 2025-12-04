import {test, beforeAll, afterAll, afterEach, expect} from 'vitest';
import supertest from 'supertest';
import http from 'http';

import * as db from './db.js';

// import * as socket from '../src/socket/mail.js';
import app from '../src/app.js';
// import {WebSocketServer} from 'ws';
// import WebSocket from 'ws';

let server;
let request;
let token;

// Setup data--------------------------------------
const goodCredentials = {
  username: 'diraheta@ucsc.edu',
  password: 'arealpassword',
};

beforeAll(async () => {
  server = http.createServer(app);
  //   wss = new WebSocketServer({server});
  //   wss.on('connection', (ws) => {
  //     socket.connect(ws);
  //   });
  server.listen();
  request = supertest(server);
  await db.reset();
  const response = await request.post('/api/v0/login')
      .send(goodCredentials)
      .expect(200);
  token = response.body.accessToken;
});

afterAll(async () => {
  db.close();
  //   wss.close();
  await server.close();
});

afterEach(async () => {
  await db.reset();
});

// GET testing ------------------------------------
test('GET posts with invalid token', async () => {
  await request.get('/api/v0/post')
      .set('Authorization', `Bearer ohmygodthistokenisfalse`)
      .expect(401);
});

test('GET posts with valid token', async () => {
  await request.get('/api/v0/post')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('GET posts return is an array type', async () => {
  const res = await request.get('/api/v0/post')
      .set('Authorization', `Bearer ${token}`);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET posts return has length 3', async () => {
  const res = await request.get('/api/v0/post')
      .set('Authorization', `Bearer ${token}`);
  expect(res.body).toHaveLength(3);
});

test('GET posts is array of objects', async () => {
  const res = await request.get('/api/v0/post')
      .set('Authorization', `Bearer ${token}`);
  res.body.forEach((post) => {
    expect(post).toEqual(expect.any(Object));
  });
});
