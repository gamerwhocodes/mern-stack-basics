const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

//connect to database
require('./db/conn');
const User = require('./model/userSchema');

app.use(express.json());
app.use(require('./router/auth'));


//listening to port
const port = process.env.PORT;

app.listen(port, () =>{console.log(" "); console.log('>> SERVER RUNNING ');console.log(`>> PORT : ${port} `)});