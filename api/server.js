// NPM
import express from 'express';
import hbs from 'express-handlebars';
import cliArgs from 'yargs';
import bodyParser from 'body-parser';

// Controllers
import Conf from './conf';
import Api from './controllers';

let App = {

  start() {

    // App bootstraping
    let app = express();
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
    app.locals.settings['x-powered-by'] = false;
    app.use(express.static(assetsPath));
    app.set('views', assetsPath);

    // Routes
    app.use('/api', Api);
    app.get(indexRoutes, (req, res) => res.render('index'));

    // Start app
    app.listen(port, () => console.log('Listening on port 3000...'));

  }

}

export default App;
