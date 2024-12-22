const express=require('express');
const app = express();

//database file
const db=require('./db.js');

// .environment file path
require('dotenv').config();

// use as a middleware
const bodyParser=require('body-parser');
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
POST=process.env.PORT || 3000;

const middleware_func=(req,res,next)=>{
console.log(`[${new Date().toLocaleString()}] response method is ${req.originalUrl}`);
next(); 
}

//static folder path
app.use(express.static('public'));


//session set up
const session=require('express-session');
app.use(session({secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized: true,
}));

app.use(middleware_func);

const { middleware } = require('./jwt.js');

app.set('view engine', 'ejs');
app.set('views','./views');

const User=require('./routes/userRoute.js');
const candidates=require('./routes/candidateRoute.js');
app.use('/user',User);
app.use('/candidate',candidates);
app.get('*',(req,res) =>{
    res.redirect('/user/login');

})

app.listen(POST,(err)=>console.log('Server created....'));