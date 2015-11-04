// NPM
import express from 'express';
import http from 'http';
import hbs from 'express-handlebars';
import cliArgs from 'yargs';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';

// Controllers
import Conf from './conf';
import Api from './controllers';
import SocketManager from './controllers/socket';

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

    // Use wrapper for socket routes
    // sm = new SocketManager(io);

    // New client connected
    io.on('connection', (socket) => {
      io.emit('test', { foo: 'great' });

      socket.on('dashboard:daily-tweets:all', () => {
    		io.emit('dashboard:daily-tweets:all', { answer: 'all!' });
    	});

    	socket.on('dashboard:daily-tweets:new', () => {
				io.emit('dashboard:daily-tweets:new', { answer: 'new!' });
    	});

    	socket.on('dashboard:daily-tweets:remove', () => {
				io.emit('dashboard:daily-tweets:remove', { answer: 'removed!' });
    	});
    });

  }

}

export default App;
