'use strict';

// NPM
var express    = require('express'),
    http       = require('http'),
    hbs        = require('express-handlebars'),
    cliArgs    = require('yargs'),
    bodyParser = require('body-parser'),
    socketIo   = require('socket.io'),
    mongoose   = require('mongoose'),
    Handlebars = require('handlebars'),
    Twit       = require('twit'),
    _          = require('lodash');

// Modules
var Conf          = require('./conf'),
    Utils         = require('./utils'),
    SocketManager = require('./controllers/socket');

// Controllers
var BnfQueueCtrl  = require('./controllers/bnfQueue');

// Workers
var twitterWorker = require('./workers/twitterWorker'),
    awsWorker     = require('./workers/awsWorker');

let App = {

  start: function() {

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
    let indexRoutes = ['/', '/dashboard', '/live', '/queue', '/stats', '/displayed', '/rejected'];

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
    // io.set('match origin protocol', true);

    // Default route serving the view otherwise
    app.get(indexRoutes, (req, res) => res.render('index'));

    // Open API for the BNF
    app.get(['/api/item.(json|txt)', '/api/bnf'], (req, res) => {
      BnfQueueCtrl.getNextQueueItem(io, (err, latestQueueItem) => {
        if (_.endsWith(req.url, 'txt') || _.endsWith(req.url, 'bnf')) {
          let file = 'api/templates/bnf_message_' + latestQueueItem.lang + '.hbs';

          // Try to send lang-customized message using template
          Utils.readFilePromisified(file)
            .then((template) => {
              let tpl = Handlebars.compile(template);
              res.send(tpl({ username: latestQueueItem.username }));
            })
            .catch(() => {
              // Some error happened, let's send regular message
              let message = [
                '@' + latestQueueItem.username,
                ' est ambassadeur pour la biodiversité en Antarctique.\n',
                'RT sur @wild_touch et découvrez l\'expédition #WildTouchExpeditions'
              ].join('');

              res.send(message);
            });
        } else {
          // Send full json
          res.json(latestQueueItem);
        }
      });
    });

    // Start the Twitter & AWS cron workers
    twitterWorker.start(io);
    awsWorker.start(io);

    // New client connected through sockets
    io.on('connection', (socket) => {
      SocketManager.handleClient(socket, io, twitterWorker);
    });

  }

};

module.exports = App;
