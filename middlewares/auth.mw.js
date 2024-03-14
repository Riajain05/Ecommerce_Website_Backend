const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../configs/auth.config")
/**
 * Create a mw which will check if the request body is correct or proper
 */

const verifySignUpBody = async(req , res , next) => {

    try{
        
        //check for the name 
        if(!req.body.name){
            return res.status(400).send({
                message : "Failed ! Name was not provided in request body"
            })
        }
        
        //check for the email
        if(!req.body.email){
            return res.status(400).send({
                message : "Failed ! Email was not provided in request body"
            })
        }
        
        //check for the userId
        if(!req.body.userId){
            return res.status(400).send({
                message : "Failed ! userId was not provided in request body"
            })
        }
        
        //check if the user with same userid is already present
        const user = await user_model.findOne({userId : req.body.userId})
        if(user){
            return res.status(400).send({
                message : "Failed ! User with same userId already present"
            }) 
        }
        
        next()

    }catch(err){
        console.log("Error while validating the request object",err)
        res.status(500).send({
            message : "Error while validating the request body"
        })
    }
}

const verifySignInBody = async(req , res , next) =>{
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed ! User id is not provided"
        }) 
    }
    if(!req.body.password){
        return res.status(400).send({
            message : "Failed ! Password is not provided"
        }) 
    }
    next()
}
 const verifyToken = (req , res , next) => {
    //check if the token is present in the header
     const token = req.header['x-access-token']
     if(!token){
        return res.status(403).send({
            message:"No token found : Unauthorized"
        })
     }
    //if it the valid token 
     jwt.verify(token , auth_config.mySecret , async(err , decoded)=>{
        if(err){
            return res.status(401).send({
                message : "Unauthorized"
            })
        }
        const user = await user_model.findOne({userId : decoded.id})
        if(!user){
            return res.status(400).send({
                message : "Unauthorized,the user for this token does not exist"
            })
        }
        //set the user info in the request body
        req.user = user
        next()
     }) 

    
    //Then move to the next step
 }

const isAdmin = (req , res , next)=> {
    const user = req.user
    if (user && user == "ADMIN"){
        next()
    }else{
        return res.status(403).send({
            message : "Only admin users are allowed to access this endpoint"
        })
    }
}
module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySignInBody : verifySignInBody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
}