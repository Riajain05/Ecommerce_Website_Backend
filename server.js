/**
 * This will be the starting file of the project
 */
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const server_config = require("./configs/server.config")
const db_config = require("./configs/db.config")
const user_model = require("./models/user.model")
const bcrypt = require('bcryptjs')

app.use(express.json()) //middleware--convert json into js object 
/**
 * Create an admin user at the starting of the application if not already present
 */

//connection with mongodb

mongoose.connect(db_config.DB_URL)

const db = mongoose.connection

db.on("error", () => {
    console.log("Error while connecting with database")
})

db.once("open", () => {
    console.log("Successfully Connected to Databse")
    init()
})

async function init() {
    try {
        let user = await user_model.findOne({ userId: "admin" })

        if (user) {
            console.log("Admin is already present")
            return
        }
    } catch (err) {
        console.log("Error while reading the data", err)
    }

    try {
        let user = await user_model.create({
            name: "Riya",
            userId: "admin",
            email: "riya05962@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("Welcome1", 8)
        })
        console.log("Admin created", user)
    }
    catch (err) {
        console.log("error while creating admin ", err)
    }

}

/**
 * Stich the routes to the srver
 */

require("./routes/auth.routes")(app)
require("./routes/category.routes")(app)


/**
 * Starting the server
 */
app.listen(server_config.PORT, () => {
    console.log("server started at port number:", server_config.PORT)
})
