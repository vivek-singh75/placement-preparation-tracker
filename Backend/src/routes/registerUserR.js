const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const register = require("../Controllers/register.controller");


router.post("/users" , register.registerUser);

router.post("/login" , register.loginUser);

router.post("/logout" , register.logoutUser);

router.get("/userDetails" , register.fetchUserdata);



module.exports = router