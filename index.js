import express from 'express';
import appSetup from './startup/init.js';
import routes from './startup/routes.js';

const app = express();

appSetup(app)
routes(app)