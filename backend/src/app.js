import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'node:path';
import OpenApiValidator from 'express-openapi-validator';
import {fileURLToPath} from 'node:url';

import {check} from './middleware/auth.js';
import * as login from './route/login.js';
import * as post from './route/post.js';
import * as group from './route/group.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/api/v0/docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4173']
}));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

app.post('/api/v0/login', login.findCredentials);
app.get('/api/v0/post', check, post.getPosts);
app.get('/api/v0/post/:postId', check, post.getPost);
app.get('/api/v0/group', check, group.getGroups);
app.post('/api/v0/post/:postId/like', check, post.putLike);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

export default app;
