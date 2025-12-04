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

// Setup data--------------------------------------
const badCredentials = {
  username: 'dilflover',
  password: 'LoveBigFatMen67',
};

const unauthCredentials = {
  username: 'dilflover@shmeat.com',
  password: 'LoveBigFatMen67',
};

const goodCredentials = {
  username: 'diraheta@ucsc.edu',
  password: 'arealpassword',
};
// POST testing -----------------------------------
test('POST INVALID URL', async () => {
  await request.post('/api/v0/login-not-real')
      .send(badCredentials)
      .expect(404);
});

test('POST BAD CREDS', async () => {
  await request.post('/api/v0/login')
      .send(badCredentials)
      .expect(400);
});

test('POST UNAUTHORIZED CREDS', async () => {
  await request.post('/api/v0/login')
      .send(unauthCredentials)
      .expect(401);
});

test('POST VALID CREDS', async () => {
  await request.post('/api/v0/login')
      .send(goodCredentials)
      .expect(200);
});

