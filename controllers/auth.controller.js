/**
 * i need to write the controller / logic to register user
 */
const bcrypt = require('bcryptjs')
const user_model = require("../models/user.model")
const jwt = require('jsonwebtoken')
const secret = require ("../configs/auth.config")

exports.signup = async (req, res) => {

    /**
     * Logic to create the user
     */

    
    //1. Read the request body
    const request_body = req.body

    
    //2. Insert the data in the Users collection in Mongodb
    const userObj = {
        name: request_body.name,
        userId: request_body.userId,
        email: request_body.email,
        userType: request_body.userType,
        password: bcrypt.hashSync(request_body.password, 8)
    }

    try {
        const user_created = await user_model.create(userObj)

        const res_obj = {
            name : user_created.name,
            userId : user_created.userId,
            userType : user_created.userType,
            email : user_created.email,
            createdAt : user_created.createdAt,
            updatedAt : user_created.updatedAt
        }
        // Return this user
        res.status(201).send(res_obj) //201 indicates something has been successfully created
    }
    catch (err) {
        console.log("Error while registering the user", err)
        res.send(500).send({
            message: "Some error is happening while registering user"
        }) //500 indicates internal server error
    }

    //3. Return the response back to user
}

exports.signin = async(req ,res) => {

    //check if the user id is present in the system
    const user = await user_model.findOne({userId : req.body.userId})
    if(user == null){
        return res.status(400).send({
            message : "userId passed is not a valid user ID"
        })
    }

    //chesk if password is correct
    const isPasswordValid = bcrypt.compareSync(req.body.password , user.password)
    if(!isPasswordValid){
        return res.status(401).send({
            message : "Incorrect Password"
        })
    }

    //using jwt we will create the access token with a given TTL(time to live) and return
    const token = jwt.sign({id : user.userId} , secret.mySecret , {expiresIn : 120})//sign is a method of jwt library which is used to create token
    
    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        accessToken : token
    })
}