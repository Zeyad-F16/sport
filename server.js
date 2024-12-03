const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
dotenv.config({path:'config.env'});
const adminRoute = require('./Routes/adminRoute');

mongoose.connect(process.env.DB_URI).then((conn)=>{
console.log(`DB Connected: ${conn.connection.host}`)
}).catch((err)=>{
  console.error(`DB Error ${err}`);
  process.exit(1);
});

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get('/',(req, res) =>{
  res.json({message : 'welcome to My APIs'});
});

app.use('/api',adminRoute);

const PORT = process.env.PORT;

app.listen(PORT , ()=>{
    console.log(`work on ${PORT}`);
});