const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const register = require("../Controllers/register.controller");


router.post("/users" , register.registerUser);
router.post("/login" , register.loginUser);


module.exports = router