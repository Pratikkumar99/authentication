const mongoose = require('mongoose');
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
//Create Person Model
const Person = mongoose.model('Person',personSchema);
module.exports = Person;