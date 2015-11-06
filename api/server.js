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
      SocketManager.handleClient(socket, io, twitterWorker);
    });

  }

}

export default App;
