import express = require('express');
import { Request, Response, NextFunction } from 'express';
import logger from 'morgan';

import connectDB from './loaders/connect';
import router from './api';

import connectMQ from './loaders/mq';

// connect with database
connectDB();
//connectMQ();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(router);
// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app
  .listen(5000, () => {
    console.log(`
      ################################################
      🛡️  Server listening on port: 5000 🛡️
      ################################################
    `);
  })
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
