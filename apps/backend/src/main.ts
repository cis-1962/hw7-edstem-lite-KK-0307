import express, { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import accountRouter from './routes/account';
import questionsRouter from './routes/questions';

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;
const MONGODB_URI =  'mongodb+srv://kayan25:0rUEuz0SNZLQsW6c@edstemdevcluster.oih88la.mongodb.net/?retryWrites=true&w=majority&appName=EdStemDevCluster';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  const app = express();

//Middleware for parsing JSON bodies
app.use(express.json());

//Session Middleware setup
app.use(session({
  secret: '0rUEuz0SNZLQsW6c',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false}
}));

//Use the account and question routers
app.use('/api/account', accountRouter);
app.use('/api/questions', questionsRouter);

// define root route
app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello, frontend!' });
});

//Error handling middlewares
const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const status = err.status || 500;
  const message = err.message || 'Something is wrong with server!';
  res.status(status).json({ message });
};

app.use(errorHandler);

// listen
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
