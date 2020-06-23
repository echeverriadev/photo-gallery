const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
require('./database');

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
  })
);

// middleware
app.set('view engine', '.hbs');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/upload'),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single('image'));

// routes
app.use(require('./routes'));

module.exports = app;
