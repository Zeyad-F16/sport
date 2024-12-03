const asynchandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const AdminDB = require('../Models/AdminModel');
const bcrypt = require('bcryptjs');

const Signup = asynchandler(async(req,res)=>{
   const {username , password} = req.body;
    
    const existingAdmin = await AdminDB.findOne({username});
    
    if(existingAdmin){
        return res.status(400).json({message: "username already exists"});
    }

    const hashedPassword = await bcrypt.hash(password , 10);
    const newAdmin = new AdminDB({username , password : hashedPassword});

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
});

module.exports = Signup ;