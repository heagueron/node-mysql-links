const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');

const passport = require('passport');


// Initializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');  // Activate engine .hbs

// Middleware

app.use(session({
    secret: 'heagueronNodeLinks',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
// Es importante mencionar que se debe declarar connect flash 
// después de declarar el paquete que estemos usando para 
// manejar sesiones.

app.use(flash()); // Messages


app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // Only receive text for now
app.use(express.json()); // for future api calls

app.use(passport.initialize());
app.use(passport.session());


// Global variables
app.use((req, res, next) => {
    // All these global values are taken from the session store
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user; 
    next();
});


// Routes
app.use(require('./routes'));  // node search index.js
app.use(require('./routes/authentication'));  
app.use('/links', require('./routes/links'));  // Prefixed by '/links'

// Public (static: js, images, css)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(app.get('port'), () => {
    console.log('Server running on port: ', app.get('port'));
});
