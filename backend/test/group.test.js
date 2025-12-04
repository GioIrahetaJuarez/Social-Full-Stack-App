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

// Setup data--------------------------------------
const mollyCredentials = {
  username: 'molly@books.com',
  password: 'mollymember',
};

const dilbertCredentials = {
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
});

afterAll(async () => {
  db.close();
  //   wss.close();
  await server.close();
});

afterEach(async () => {
  await db.reset();
});

// Helper functions ----------------------------------------------------
/**
 * Help set token for diff credentials
 * @param {object} credentials omg
 * @returns {object} token
 */
async function logIn(credentials) {
  const response = await request.post('/api/v0/login')
      .send(credentials)
      .expect(200);
  return response.body.accessToken;
}

// GET GROUP MEMBER testing --------------------------------------------
test('GET GROUP from member returns 200', async () => {
  const token = await logIn(mollyCredentials);
  await request.get(`/api/v0/group`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('GET GROUP from member', async () => {
  const token = await logIn(mollyCredentials);
  const res = await request.get(`/api/v0/group`)
      .set('Authorization', `Bearer ${token}`);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET GROUP molly should be in 1 groups', async () => {
  const token = await logIn(mollyCredentials);
  const res = await request.get(`/api/v0/group`)
      .set('Authorization', `Bearer ${token}`);
  expect(res.body).toHaveLength(1);
});

test('GET GROUP dilbert should be in 2 groups', async () => {
  const token = await logIn(dilbertCredentials);
  const res = await request.get(`/api/v0/group`)
      .set('Authorization', `Bearer ${token}`);
  expect(res.body).toHaveLength(2);
});

// GET GROUP POST ADVANCED testing ------------------------------------
test('GET ADVANCED posts group exclusively', async () => {
  const token = await logIn(mollyCredentials);
  let res = await request.get(`/api/v0/group`)
      .set('Authorization', `Bearer ${token}`);
  const group = res.body[0].id;
  res = await request.get(`/api/v0/post?groupId=${group}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});
