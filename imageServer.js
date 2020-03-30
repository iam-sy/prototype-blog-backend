import express from 'express';
import path from 'path';
import logger from 'morgan';
const app = express();
app.use(logger('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
