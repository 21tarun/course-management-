const mongoose =require('mongoose')


const employeeSchema= new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:['Employee','Admin','Super Admin'],
        default:'Employee'
    }
})

module.exports=mongoose.model('employee',employeeSchema)