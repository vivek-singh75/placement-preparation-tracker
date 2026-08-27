const express = require("express");
const bcrypt= require("bcrypt");
const jwt  = require('jsonwebtoken');
const Questions = require("../Controllers/question.controller")

const router  = express.Router(); 

router.post("/addQuestion" ,Questions.addQuestion )

router.get('/getQuestion', Questions.getQuestion)

module.exports = router