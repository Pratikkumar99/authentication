const express = require('express');//require or import the express
const router = express.Router();//then import the Router function from express property

const menuItems = require('./../models/MenuItems');
const MenuItem = require('./../models/MenuItems');


router.post('/',async (req,res)=>{
    try{
         const data = req.body;//asssuming the request body contains the person data
        //create a new Person document using the Mongoose model
        const menuItems = new MenuItem(data);

        //save the new Person to the database
        const response = await menuItems.save();
        console.log("data saved",response);
        res.status(200).json(response);       
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal Server error"});
    }
})
router.get('/',async (req,res)=>{
    try{
        const data =await MenuItem.find();
        console.log('Data fetched succesfully');
        res.status(200).json(data);
    }catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal Server error"});
    }
})

router.get('/:taste',async(req,res)=>{
    try {
        const tastetype = req.params.taste;
        if(tastetype=='sour'||tastetype=='spicy'||tastetype=='sweat'||tastetype=='salty'){
            const response = await MenuItem.find({taste:tastetype});
            console.log("data fetched!");
            res.status(200).json(response);
        }
        else{
            res.status(404).json({error : "Invalid taste type!"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal Server error"});
    }
})
module.exports = router;