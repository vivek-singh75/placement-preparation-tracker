const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const register = require("../Controllers/register.controller");
const middleware = require("../middleware/auth.middleware")

router.post("/users" , register.registerUser);

router.post("/login" , register.loginUser);

router.get("/userDetails" , register.fetchUserdata);

router.delete("/logout" , register.logoutUser);

router.patch("/updateData" ,middleware.authMiddleware,  register.updateUserData);

 
module.exports = router