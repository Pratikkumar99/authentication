//set up passport with a local authentication Strategy, using model for use 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person')

passport.use(new LocalStrategy( async (USERNAME,password,done)=>{
    //authentication logic here
    try {
        //nsole.log('Received credentials : ',USERNAME,password);
        const user =await Person.findOne({username : USERNAME });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isPasswordMatch =await user.comparePassword(password);
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

module.exports = passport; //Export configured password