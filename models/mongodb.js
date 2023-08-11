const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/adminpanel')
.then(()=>{
    console.log("mongoDB connected");
})
.catch(()=>{
    console.log("failed to connected");
})

const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true

    },
    password:{
        type:String,
        require:true
    },
    admin:{
        type:Boolean,
        default:false 
    },

}) 

const collection = new mongoose.model("Colleciton1",LoginSchema)
module.exports = collection