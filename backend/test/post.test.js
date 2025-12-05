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
const dilbertCredentials = {
  username: 'diraheta@ucsc.edu',
  password: 'arealpassword',
};

const samCredentials = {
  username: 'sam@snapchat.com',
  password: 'waitimdelusional',
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
      .send(dilbertCredentials)
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
// Get all posts
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

test('GET posts is array of objects', async () => {
  const res = await request.get('/api/v0/post')
      .set('Authorization', `Bearer ${token}`);
  res.body.forEach((post) => {
    expect(post).toEqual(expect.any(Object));
  });
});

// Get individual post
test('GET posts with nonexistent ID', async () => {
  const response = await request.get('/api/v0/post')
      .set('Authorization', `Bearer ${token}`);
  const firstPostId = response.body[0].id;
  await request.get(`/api/v0/post/${firstPostId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('GET posts with nonexistent ID', async () => {
  const firstPostId = '00000000-0000-0000-0000-000000000000';
  await request.get(`/api/v0/post/${firstPostId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('GET forbidden post', async () => {
  const loginResponse = await request.post('/api/v0/login')
      .send(samCredentials);
  const samsToken = loginResponse.body.accessToken;
  const dilbertGroupResponse = await request.get(`/api/v0/group`)
      .set('Authorization', `Bearer ${token}`);
  const firstGroup = dilbertGroupResponse.body[0].id;
  const groupPosts = await request.get(`/api/v0/post?groupId=${firstGroup}`)
      .set('Authorization', `Bearer ${token}`);
  const firstPostId = groupPosts.body[0].id;
  await request.get(`/api/v0/post/${firstPostId}`)
      .set('Authorization', `Bearer ${samsToken}`)
      .expect(403);
});
