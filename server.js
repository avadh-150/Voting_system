const express=require('express');
const app = express();

//database file
const db=require('./db.js');

// .environment file path
require('dotenv').config();

// use as a middleware
const bodyParser=require('body-parser');
app.use(bodyParser.json());
POST=process.env.PORT || 3000;

const middleware_func=(req,res,next)=>{
console.log(`[${new Date().toLocaleString()}] response method is ${req.originalUrl}`);
next(); 
}


app.use(middleware_func);

const { middleware } = require('./jwt.js');

app.get('/',(req,res)=>{    
 res.send("Hello world! and your application will be started!");   

})

const User=require('./routes/userRoute.js');
const candidates=require('./routes/candidateRoute.js');
app.use('/user',User);
app.use('/candidate',middleware,candidates);

app.listen(POST,()=>console.log('Server created....'));