const mongoose = require('mongoose');

const dbConnetion = ()=>{
    mongoose.connect(process.env.DB_URI)
    .then((conn)=>{
        console.log(`DB Connected: ${conn.connection.host}`);
        })};

module.exports = dbConnetion;