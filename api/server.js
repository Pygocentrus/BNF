// NPM
import express from 'express';
import http from 'http';
import hbs from 'express-handlebars';
import cliArgs from 'yargs';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import mongoose from 'mongoose';
import _ from 'lodash';

import Twit from 'twit';

// Modules
import Conf from './conf';
import Api from './routers';
import SocketManager from './controllers/socket';

// Controllers
import DailyTweetsCtrl from './controllers/dailyTweets';
import LivestreamCtrl from './controllers/liveStream';
import BnfQueueCtrl from './controllers/bnfQueue';

// Workers
import twitterWorker from './workers/twitterWorker';

let App = {

  start() {

    // App bootstraping
    let app = express();
    let server = http.Server(app);
    let isPaused = false;
    let io, sm;

    // App conf according to ENV
    let args = cliArgs.argv;
    let assetsPath = __dirname + '/../' + (args.production ? 'public' : 'app');
    let port = args.production ? Conf.ports.prod : Conf.ports.dev;

    // Connect to mongo server
    let mongoUri = args.production ? Conf.mongo.prod : Conf.mongo.dev;
    mongoose.connect('mongodb://' + mongoUri);

    // Front reserved routes that are
    // being rerouted towards index
    let indexRoutes = ['/', '/dashboard', '/live', '/queue', '/validated', '/rejected'];

    // Body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    // Params & options
    app.engine('html', hbs({ extname: 'html' }));
    app.set('view engine', 'html');
    app.use(express.static(assetsPath));
    app.set('views', assetsPath);

    // CORS
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    // Start app
    server.listen(port, () => console.log('Listening on port ' + port + '...'));

    // Link socket through the http server
    io = socketIo(server);

    // Socket transport mode
    io.set('transports', ['polling', 'websocket']);

    // API Routes
    // app.use('/api', Api);
    // Default route serving the view otherwise
    app.get(indexRoutes, (req, res) => res.render('index'));

    // Open API for the BNF
    app.get('/api/item.(json|txt)', (req, res) => {
      BnfQueueCtrl.getNextQueueItem(io, (err, latestQueueItem) => {
        if (_.endsWith(req.url, 'txt')) {
          res.send(latestQueueItem.username);
        } else {
          res.json(latestQueueItem);
        }
      });
    });

    // Start the Twitter worker
    twitterWorker.start(io);

    // New client connected
    io.on('connection', (socket) => {
      // Dashboard all tweets
      socket.on('dashboard:daily-tweets:all', () => {
        DailyTweetsCtrl.getDailyTweets((err, dailyTweets) => {
          io.emit('dashboard:daily-tweets:all', { dailyTweets: dailyTweets, err: err });
        });
    	});

      // New daily tweet added
    	socket.on('dashboard:daily-tweets:new', (tweet) => {
        DailyTweetsCtrl.postDailyTweet(tweet, (err, newTweet) => {
          io.emit('dashboard:daily-tweets:new', { tweet: newTweet, err: err });
        });
    	});

      // Remove daily tweet
    	socket.on('dashboard:daily-tweets:remove', () => {
				io.emit('dashboard:daily-tweets:remove', { answer: 'removed!' });
    	});

      // Get all rewteets in the /live
      socket.on('livestream:retweets:all', () => {
        LivestreamCtrl.getReTweets((err, retweets) => {
          io.emit('livestream:retweets:all', { retweets: retweets, err: err });
        });
      });

      // Get 50 tweets from the livestream
      socket.on('livestream:retweets:more', (options) => {
        options = options || {};
        LivestreamCtrl.getMoreTweets(options, (err, retweets) => {
          io.emit('livestream:retweets:more', { retweets: retweets, err: err });
        });
      });

      // Toggle play/pause, e.g whether we should listen to the stream API
      socket.on('livestream:retweets:toggle:playpause', (data) => {
        twitterWorker.setPauseState(data.state === 'paused');
      });

      // Validate a retweet
      socket.on('livestream:retweets:validate', (retweet) => {
        let options = { hasBeenValidated: true, isValid: true };

        LivestreamCtrl.updateReTweet(retweet, options, (err, rt) => {
          if (!err) {
            io.emit('livestream:retweets:validate', { retweet: rt, err: err });
          }
        });
      });

      // Reject a retweet
      socket.on('livestream:retweets:reject', (retweet) => {
        let options = { hasBeenValidated: true, isValid: false };

        LivestreamCtrl.updateReTweet(retweet, options, (err, rt) => {
          if (!err) {
            io.emit('livestream:retweets:reject', { retweet: rt, err: err });
          }
        });
      });

      // Ask for all validated retweets in the display queue
      socket.on('queue:retweets:all', () => {
        BnfQueueCtrl.getQueueReTweets((err, retweets) => {
          io.emit('queue:retweets:all', { retweets: retweets, err: err });
        });
      });

      // Cancel an enqueued tweet
      socket.on('queue:retweets:cancel', (data) => {
        BnfQueueCtrl.cancelQueueReTweet(data.retweetId, (err, tweet) => {
          io.emit('queue:retweets:cancel', { retweet: tweet, err: err });
        });
      });
    });

  }

}

export default App;
