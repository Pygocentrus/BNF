// NPM
import express, { Router } from 'express';
import LivestreamCtrl from '../controllers/LiveStream';

let router = new Router();

router.get('/live-tweets', (req, res) => {

  console.log('Watching livestream');

  LivestreamCtrl.watchLivestream();

  res.send('Live tweets');
});

export default router;
