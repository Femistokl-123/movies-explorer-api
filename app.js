const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const errorMiddleware = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes/index');

const { MONGO_URL, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb');

const app = express();

app.use(helmet());

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

const { PORT = 3000 } = process.env;

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT);
