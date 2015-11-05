// NPM
import express from 'express';
import http from 'http';
import hbs from 'express-handlebars';
import cliArgs from 'yargs';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import mongoose from 'mongoose';

import Twit from 'twit';

// Modules
import Conf from './conf';
import Api from './routers';
import SocketManager from './controllers/socket';

// Controllers
import DailyTweetsCtrl from './controllers/dailyTweets';
import LivestreamCtrl from './controllers/liveStream';

// Workers
import twitterWorker from './workers/twitterWorker';

let App = {

  start() {

    // App bootstraping
    let app = express();
    let server = http.Server(app);
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

    // API Routes
    app.use('/api', Api);
    // Default route serving the view otherwise
    app.get(indexRoutes, (req, res) => res.render('index'));

    // Start app
    server.listen(port, () => console.log('Listening on port 3000...'));

    // Link socket through the http server
    io = socketIo(server);

    // Socket transport mode
    io.set('transports', ['polling', 'websocket']);

    // Start the Twitter worker
    twitterWorker(io);

    // New client connected
    io.on('connection', (socket) => {
      socket.on('dashboard:daily-tweets:all', () => {
        DailyTweetsCtrl.getDailyTweets((err, dailyTweets) => {
          io.emit('dashboard:daily-tweets:all', { dailyTweets: dailyTweets, err: err });
        });
    	});

    	socket.on('dashboard:daily-tweets:new', (tweet) => {
        DailyTweetsCtrl.postDailyTweet(tweet, (err, newTweet) => {
          io.emit('dashboard:daily-tweets:new', { tweet: newTweet, err: err });
        });
    	});

    	socket.on('dashboard:daily-tweets:remove', () => {
				io.emit('dashboard:daily-tweets:remove', { answer: 'removed!' });
    	});

      socket.on('livestream:retweets:all', () => {
        LivestreamCtrl.getReTweets((err, retweets) => {
          io.emit('livestream:retweets:all', { retweets: retweets, err: err });
        });
      });

      socket.on('livestream:retweets:validate', (retweet) => {
        let options = { hasBeenValidated: true, isValid: true };

        LivestreamCtrl.updateReTweet(retweet, options, (err, rt) => {
          if (!err) {
            io.emit('livestream:retweets:validate', { retweet: rt, err: err });
          }
        });
      });

      socket.on('livestream:retweets:reject', (retweet) => {
        let options = { hasBeenValidated: true, isValid: false };

        LivestreamCtrl.updateReTweet(retweet, options, (err, rt) => {
          if (!err) {
            io.emit('livestream:retweets:reject', { retweet: rt, err: err });
          }
        });
      });
    });

  }

}

export default App;
