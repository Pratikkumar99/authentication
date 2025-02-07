const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { deleteOne } = require('./MenuItems');
//Define the person Schema/so that what you want from user in what schema so that input on point to point
const personSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    age:{
        type: Number 
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

//pre is middleware function executes before save();
personSchema.pre('save',async function (next) {
    const person = this;//sara data person me store hoga..

    //Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();//Returns true if any of the given paths are modified, else false. If no arguments, returns true if any path in this document is modified.
    try{
        //hash password generation : 
        const salt = await bcrypt.genSalt(10);//10 digit ka salt generator..
        
        //hash Password : ye hashed password banata h hash + password leke
        const hashedPassword = await bcrypt.hash(person.password,salt);
        person.password = hashedPassword;//assign the user password with hashed password

        next();
    }
    catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){
    try {
         //Use bcrypt to compare the providec password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;

    } catch (error) {
       throw error;
    }
}

//Create Person Model
const Person = mongoose.model('Person',personSchema);
module.exports = Person;