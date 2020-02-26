const express = require('express');
const app = express();
const path = require('path');
const createError = require('http-errors');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const _ = require('lodash');

// const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const userApi = require('./api/users');
const productApi = require('./api/product');
const productTypeApi = require('./api/productType');
const blogApi = require('./api/blog');
const blogTypeApi = require('./api/blogType');

// set public path
app.use(express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '?' });
// app.set('env','production')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/api', [
  userApi,
  productApi,
  productTypeApi,
  blogApi,
  blogTypeApi
]);

app.use(function (req, res, next) {
  var err = createError(404)
  next(err)
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500);
  res.render('error');
})

app.listen(process.env.PORT || port, function () {
  console.log(`Example app listening on port ${port}!`);
})