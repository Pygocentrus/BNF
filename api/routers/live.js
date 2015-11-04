import express, { Router } from 'express';
let router = new Router();

router.get('/live-tweets', (req, res) => {
  res.send('Live tweets');
});

export default router;
