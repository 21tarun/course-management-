const jwt = require('jsonwebtoken')


const authentication = async function(req,res,next){
    const token = req.headers['x-api-key']
    if(!token) return res.status(400).send({status:false,message:"missing mandatory header"})
    const decodedToken = jwt.verify(token,"kuchhBhi",function(err,decodedToken){
        if(err) return res.status(401).send({status:false,message:"you are not authenticated"})
        else{
            console.log(decodedToken)
            req.id=decodedToken.id
            req.role=decodedToken.role
            next()
        }
    })
    
}





module.exports.authentication=authentication