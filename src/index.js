const express= require('express')
const mongoose=require('mongoose')
const app =express()
const route= require('./routes/route')

mongoose.set('strictQuery',true)
app.use(express.json())

mongoose.connect("mongodb+srv://tarun21:tarun1616@cluster0.h0l8mir.mongodb.net/courseManagement",
{useNewUrlParser:true}
)
.then(()=>console.log("MongoDb is connected"))
.catch(err => console.log(err))



app.use('/',route)

app.listen(3000, function(){
    console.log("server running on port" + 3000)
})