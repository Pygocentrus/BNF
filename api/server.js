import express from 'express';
import hbs from 'express-handlebars';
import cliArgs from 'yargs';

let App = {

  start() {

    let app = express();
    let args = cliArgs.argv;
    let assetsPath = __dirname + '/../' + (args.production ? 'public' : 'app');

    app.engine('html', hbs({ extname: 'html' }));
    app.set('view engine', 'html');
    app.locals.settings['x-powered-by'] = false;

    app.use(express.static(assetsPath));
    app.set('views', assetsPath);

    app.get('*', (req, res) => res.render('index'));

    app.listen(3000, () => console.log('Listening on port 3000...'));

  }

}

export default App;
