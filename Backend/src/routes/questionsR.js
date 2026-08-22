const express = require("express");
const bcrypt= require("bcrypt");
const jwt  = require('jsonwebtoken');
const addQuestion = require("../Controllers/question.controller")

const router  = express.Router(); 

router.post("/addQuestion" ,addQuestion.addQuestion )


module.exports = router