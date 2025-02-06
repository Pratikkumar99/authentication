const express = require('express');
const app = express();//app as functionality of express
const db =require('./db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person')

//Body Parser is middleware library for express.js
//bodyParser.json() automatically parses the JSON
//  data from the request body and convert it into
//  a javaScript object, whic is then stored in 
// the req.body
const bodyParser = require('body-parser');
app.use(bodyParser.json());//req.body me store kr lega

//middleware function 
const logRequest = (req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
    next();//move on to the next phase
}

app.use(logRequest);

passport.use(new LocalStrategy( async (USERNAME,password,done)=>{
    //authentication logic here
    try {
        console.log('Received credentials : ',USERNAME,password);
        const user =await Person.findOne({username : USERNAME });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isPasswordMatch = user.password === password ? true : false;
        if(isPasswordMatch){
            return done(null,user);
        }
        else{
            return done(null, false, {message : 'Incorrect Password.'})
        }
        
    } catch (error) {
        return done(error);
    }
}))

app.use(passport.initialize());
const authenticationMiddleware = passport.authenticate('local',{session:false});
app.get('/',authenticationMiddleware,function(req,res){
    res.send("welcome to my hotel.. How i can help you ?");
})

//import the router files:
const personRoutes = require('./routes/PersonRoutes');
const menuRoutes = require('./routes/MenuRoutes');


//use the routers
app.use('/person',authenticationMiddleware,personRoutes);
app.use('/menu',authenticationMiddleware,menuRoutes);

app.listen(4000,()=>{
    console.log('Listening on port 4000');
})
