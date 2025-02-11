const express = require('express');
const app = express();//app as functionality of express
const db =require('./db');
const passport = require('./auth');

//Body Parser is middleware library for express.js
//bodyParser.json() automatically parses the JSON
//  data from the request body and convert it into
//  a javaScript object, whic is then stored in 
// the req.body
const bodyParser = require('body-parser');
app.use(bodyParser.json());//req.body me store kr lega
const PORT = process.env.PORT || 4000;

//middleware function 
const logRequest = (req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
    next();//move on to the next phase
}

app.use(logRequest);


app.use(passport.initialize());
const authenticationMiddleware = passport.authenticate('local',{session:false});
app.get('/',function(req,res){
    res.send("welcome to my hotel.. How i can help you ?");
})

//import the router files:
const personRoutes = require('./routes/PersonRoutes');
const menuRoutes = require('./routes/MenuRoutes');


//use the routers
app.use('/person',personRoutes);
app.use('/menu',menuRoutes);

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})
