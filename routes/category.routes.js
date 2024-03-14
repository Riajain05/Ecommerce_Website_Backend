/**
 * POST localhost:8080/ecomm/api/v1/auth/categories
 */
const categoryController = require("../controllers/category.controller")
const auth_mw = require("../middlewares/auth.mw")

module.exports = (app) => {
    app.post("/ecomm/api/v1/auth/categories",[auth_mw.verifyToken , auth_mw.isAdmin] ,categoryController.createNewCategory )
}