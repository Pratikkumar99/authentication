const express = require('express');
const router = express.Router(); 

const Person = require('./../models/Person');
const { message } = require('prompt');
const { jwtAuthMiddleware,generateToken } = require('../jwt');
const { compare } = require('bcrypt');
//GET method to get the the data from the database: 
router.get('/',jwtAuthMiddleware,async (req,res)=>{
    try{
        const data =await Person.find();
        console.log('Data fetched succesfully');
        res.status(200).json(data);
    }catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal Server error"});
    }
})

// router.get('/:workType',async (req,res)=>{
//     try{
//         const workType = req.params.workType;//that Extract the worktype from url
//         if(workType == 'chef'|| workType == 'manager'||workType=='waiter'){
//             const response = await Person.find({work : workType});
//             console.log('Response fetched');
//             res.status(200).json(response);
//         }else{
//             res.status(404).json({error : "Invalid work type!"})
//         }
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({error : "Internal Server error"});
//     }
// })
//POST route to add a person
router.post('/signup',async (req,res)=>{
    try {
        const data = req.body;//asssuming the request body contains the person data
        //create a new Person document using the Mongoose model
        const newPerson = new Person(data);

        //save the new Person to the database
        const response = await newPerson.save();
        console.log("data saved",response);
        const payload = {
            id : response.id,//unique id of a person data.. 
            username: response.username
        }
        console.log(JSON.stringify(payload));
        const token =generateToken(payload);
        console.log("Token is : ",token);
        res.status(200).json({response : response,token : token});

    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal Server error"});
    }
})

//update method : to update anything inside the id : 
router.put('/:id',async (req,res)=>{
    try {
        const personId = req.params.id;//Extract the id from the URL parameter
        const updatedPersonData = req.body;//updated data for the person

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData,{
            new : true,//return updated document
            runValidators:true,//run mongoose validation
        })
        if(!response){
            return res.status(404).json({error : 'Person not found!'});
        }
        console.log('Data updated');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Internal server error'});
    }
})

router.delete('/:id',async(req,res)=>{
    try {
        const PersonId = req.params.id;//Extract the id from the URL parameter
        const response = await Person.findByIdAndDelete(PersonId);
        if(!response){
            return res.status(404).json({error : 'Person not found!'});
        }
        console.log('Data deleted succesfully');
        res.status(200).json({message : 'Data deleted succesfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Internal server error'});
    }
})
//login route will provide token when we enter username and password....
router.post('/login',async(req,res)=>{
    try {
        //Extract username and password from the request body
        const {username,password} = req.body;

        //find user from username
        const user = await Person.findOne({username : username});

        //if user doesnot exist and password donaot match , return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error : 'Invalid Username or Password'});
        }

        //generate token 
        const payload = {
            id : user.id,
            username : user.username
        }
        const token = generateToken(payload);
        //return payload as response : 
        res.json({token});

    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Internal server error'});
    }
})

//create an profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try {
        //from the data
        const userData = req.user;
        console.log("User Data",userData);

        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({user});
    } catch (err) {
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
})
module.exports =router;