require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const routes = require('./routes/products.js');
const notFoundMiddleware = require('./middleware/not-found.js');
const customErrorMiddleware = require('./middleware/error-handler.js');
const db = require('./db/connect.js');

app.use(express.json());

app.use('/api/v1/products', routes);

app.get('/', (req, res) => {
  res.status(200).send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use(notFoundMiddleware);
app.use(customErrorMiddleware);

const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log('port is listening....')
    })
  } catch (err) {
    console.log(err);
  }
}

start();