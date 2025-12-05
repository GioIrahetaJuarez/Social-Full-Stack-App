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
