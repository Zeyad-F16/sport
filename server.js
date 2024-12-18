const express = require('express');

const dotenv = require('dotenv');

const morgan = require('morgan');

const path = require('path');

const xss = require('xss-clean');

const compression = require('compression');

const { rateLimit } = require("express-rate-limit");

const mongoSanitize = require('express-mongo-sanitize');

const cors = require('cors');

dotenv.config({path:'config.env'});

const dbConnection = require('./config/DB-Connection');

const MountRoutes = require('./Routes/index');

const ApiError = require('./utils/ApiError');

const GlobalError = require('./Middlewares/ErrorMiddleware');

dbConnection();

const app = express();

app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression());

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
  console.log(`${process.env.NODE_ENV} mode`);
 }

app.get('/',(req, res) =>{
  res.json({message : 'welcome to My APIs'});
});

app.use(mongoSanitize());
app.use(xss());

// Limit each Ip to 100 requests per 'window' (here, per 15 mintues)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message:
  "Too many requests created from this IP, please try again after an hour",
});
app.use("/api/", apiLimiter);

MountRoutes(app);

//  error handling middleware for routes
app.all('*',(req, res ,next)=>{
  next(new ApiError(`can't find this route : ${req.originalUrl}`,404));
});

app.use(GlobalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT,()=>{
  console.log(`running on port ${PORT}`);
});

 // handle rejection outside express (database connection)
 process.on('unhandledRejection',(err)=>{
  console.log(`Database Error: ${err.name} | ${err.message}`);
  server.close(()=>{
    console.log(`shutting down...`);
    process.exit(1);
  });
});