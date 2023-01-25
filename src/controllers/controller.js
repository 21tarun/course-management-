
const employeeModel = require('../models/employeeModel')
const courseModel = require('../models/courseModel')
const validator = require('validator')
const jwt =require('jsonwebtoken')



const createEmployee = async function (req, res) {
    const data = req.body
    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please provide data" })

    if(!data.name)  return res.status(400).send({status:false,message:"name is mandatory"})
    //check validation for email ---------------------------------------------------------------
    if(!data.email) return res.status(400).send({status:false,message:"email is mandatory"})
    if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, msg: "please enter valid email address!" })

    let checkEmail = await employeeModel.findOne({ email: data.email })
    if (checkEmail) return res.status(400).send({ status: false, message: "email is already exist" })

    // check validation for password---------------------------------------------------------------
    if(!data.password)  return res.status(400).send({status:false,message:"password is mandatory"})
    if (!(data.password.match(/(?=.{8,15})/))) return res.status(400).send({ status: false, error: "Password should be of atleast 8 charactors" })
    if (!(data.password.match(/.*[a-zA-Z]/))) return res.status(400).send({ status: false, error: "Password should contain alphabets" })
    if (!(data.password.match(/.*\d/))) return res.status(400).send({ status: false, error: "Password should contain digits" })

    if(data.role) {
        if (!(["Employee", "Admin", "Super Admin"].includes(data.role))) return res.status(400).send({ status: false, message: "you can use only Employee, Admin, Super Admin" })
    }

    const saveData = await employeeModel.create(data)
    res.status(201).send({status:true,message:"successfully signUp",data:saveData})

}


const signIn= async function(req,res){
    const data=req.body
    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please provide data" })
    if(!data.email) return res.status(400).send({status:false,message:"email is mandatory"})
    if(!data.password)  return res.status(400).send({status:false,message:"password is mandatory"})


    const employee = await employeeModel.findOne({email:data.email,password:data.password})
    if(!employee) return res.status(400).send({status:false,message:"incorrect email and password"})


    let token = jwt.sign({id: employee._id,role:employee.role},"kuchhBhi",{expiresIn:'1h'})
        
    res.setHeader("x-api-key", token)

    res.status(200).send({status:true,message:"logged in Successfully",Token:token})



}   


const createCourse =async function(req,res){
    const data=req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"body empty"})

    if(!data.title) return res.status(400).send({status:false,message:"title mandatory"})
    if(!data.description) return res.status(400).send({status:false,message:"description mandatory"})
    if(!data.videourl) return res.status(400).send({status:false,message:"videourl mandatory"})
    if(!data.topics) return res.status(400).send({status:false,message:"topics mandatory"})
    if(!data.duration) return res.status(400).send({status:false,message:"duration mandatory"})
    if(!data.category) return res.status(400).send({status:false,message:"category mandatory"})

    //authorization
    if(req.role!='Admin') return res.status(403).send({status:false,message:"you are not autherized to create course"})

    const saveData = await courseModel.create(data)
    res.status(201).send({status:true,data:saveData})

}


const updateCourse= async function(req,res){
    const courseId= req.params.courseId
    const updationDetails =req.body
    if(Object.keys(updationDetails).length==0) return res.status(400).send({status:false,message:"there is no updation details for update"})
    const course =await courseModel.findOne({_id:courseId,isDeleted:false})
    if(!course) return res.status(404).send({status:false,message:"course not found"})
    //authorization
    if(req.role!="Admin") return res.status(403).send({status:false,message:"you are not autherized to update course"})

    updationDetails.approved=false
    const updatedData =await courseModel.findByIdAndUpdate(courseId,{$set:updationDetails},{new:true})

    res.status(200).send({status:true,message:"Update successfully",data:updatedData})
}


const deleteCourse =async function(req,res){
    const courseId= req.params.courseId
    const course =await courseModel.findOne({_id:courseId,isDeleted:false})
    if(!course) return res.status(404).send({status:false,message:"course not found"})

    //authorization
    if(req.role!="Admin") return res.status(403).send({status:false,message:"you are not autherized to delete course"})

    const updatedData =await courseModel.findByIdAndUpdate(courseId,{$set:{isDeleted:true}},{new:true})

    res.status(200).send({status:true,message:"Delete successfully",data:updatedData})
}


const approvedCourse= async function(req,res){
    const courseId = req.params.courseId
    const course =await courseModel.findOne({_id:courseId,isDeleted:false})
    if(!course) return res.status(404).send({status:false,message:"course not found"})

    //authorization
    if(req.role!="Super Admin") return res.status(403).send({status:false,message:"you are not autherized to approved course"})

    const updatedData =await courseModel.findByIdAndUpdate(courseId,{$set:{approved:true}},{new:true})

    res.status(200).send({status:true,message:"Approved successfully",data:updatedData})

}


const getCourses =async function(req,res){
    if(req.role=='Employee'|| req.role=='Admin'){
        const courses =await courseModel.find({isDeleted:false,approved:true})
        if(courses.length==0) return res.status(404).send({status:false,message:"courses not found"})
        res.status(200).send({status:true,data:courses})
    }
    else{
        const courses =await courseModel.find({isDeleted:false})
        if(courses.length==0) return res.status(404).send({status:false,message:"courses not found"})
        res.status(200).send({status:true,data:courses})
    }
}

const pipeline = [

    { $group: { _id: "$category"} }
];
const sortCourses =async function(req,res){
    let sortcourseObj={}
    const aggCursor = courseModel.aggregate(pipeline);
    for await (const doc of aggCursor) {
        const courses =await courseModel.find({category:doc._id})
        
        sortcourseObj[doc._id]= courses
    }
    res.status(200).send({status:true,data:sortcourseObj})
}

module.exports.createEmployee = createEmployee
module.exports.signIn=signIn
module.exports.createCourse=createCourse
module.exports.updateCourse=updateCourse
module.exports.deleteCourse=deleteCourse
module.exports.approvedCourse=approvedCourse
module.exports.getCourses=getCourses
module.exports.sortCourses=sortCourses