const express = require("express");
const bcrypt= require("bcrypt");
const jwt  = require('jsonwebtoken');

const router  = express.Router(); 

const Questions = require("../Controllers/question.controller")


router.post("/addQuestion" ,Questions.addQuestion )

router.get('/getQuestion', Questions.getQuestion)

module.exports = router