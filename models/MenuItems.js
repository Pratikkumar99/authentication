const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required :true
    },
    price:{
        type: Number,
        required :true,
        default :0
    },
    ingredients :{
        type: [String],
        required :true,
        default : []
    },
    taste:{
        type : String,
        enum : ['sour','sweat','salty','spicy']
    },
    is_drink: {
        type : Boolean,
        default : false
    },
    num_sales :{
        type : Number,
        default : 0
    }
})
const MenuItem = mongoose.model('MenuItem',menuSchema);
module.exports = MenuItem;
