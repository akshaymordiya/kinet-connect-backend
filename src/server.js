require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const router = require('./routes');
const ErrorHandler = require('./utils/errorHandler');
const config = require('./config/config');
const cookieParser = require('cookie-parser');
const { connectDatabase } = require('./database');

const app = express();

connectDatabase();

app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(express.json({
  limit: "8mb"
}));

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use(compression());

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
}));

app.options("*", cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

app.use('/api/v1/', router);

app.use((_, res, next) => {
  return res.status(httpStatus.NOT_FOUND).json({
    statusCode: httpStatus.NOT_FOUND,
    error: "Route not found!"
  })
})

app.listen(config.port, () => console.log(`Server Running on ${config.port}`));


      