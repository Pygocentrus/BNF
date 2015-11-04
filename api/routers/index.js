// NPM
import express, { Router } from 'express';
import bodyParser from 'body-parser';

// Modules
import Dashboard from './dashboard';
import Live from './live';

let router = new Router();

// Combine other route handlers
// according to different API endpoints
router.use(Dashboard);
router.use(Live);

export default router;
