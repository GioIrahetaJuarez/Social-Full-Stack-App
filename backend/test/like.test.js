import {test, beforeAll, afterAll, afterEach} from 'vitest';
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

// POST testing ------------------------------------
test('POST like', async () => {
  const res = await request.get('/api/v0/post')
      .set('Authorization', `Bearer ${token}`);
  const postId = res.body[0].id;
  await request.post(`/api/v0/post/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
});

test('POST like on missing post', async () => {
  const postId = '00000000-0000-0000-0000-000000000000';
  await request.post(`/api/v0/post/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('POST like on unauthorized post', async () => {
  const loginResponse = await request.post('/api/v0/login')
      .send(samCredentials);
  const samsToken = loginResponse.body.accessToken;
  const dilbertGroupResponse = await request.get(`/api/v0/group`)
      .set('Authorization', `Bearer ${token}`);
  const firstGroup = dilbertGroupResponse.body[0].id;
  const groupPosts = await request.get(`/api/v0/post?groupId=${firstGroup}`)
      .set('Authorization', `Bearer ${token}`);
  const firstPostId = groupPosts.body[0].id;
  await request.post(`/api/v0/post/${firstPostId}/like`)
      .set('Authorization', `Bearer ${samsToken}`)
      .expect(403);
});

