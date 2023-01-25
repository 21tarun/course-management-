const mongoose =require('mongoose')


const courseSchema= new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    videoUrl:{
        type:String
    },
    topics:{
        type:[String]
    },
    duration:{
        type:String
    },
    category:{
        type:String
    },
    approved:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('course',courseSchema)