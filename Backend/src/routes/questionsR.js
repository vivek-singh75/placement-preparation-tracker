const express = require("express");
const bcrypt= require("bcrypt");
const jwt  = require('jsonwebtoken');

const router  = express.Router(); 

const Questions = require("../Controllers/question.controller")
const middleware = require("../middleware/auth.middleware")


router.post("/addQuestion" ,Questions.addQuestion );

router.get('/getQuestion', Questions.getQuestion);

router.get( "/dsaAnalytics", middleware.authMiddleware, Questions.dsaAnalytics );

module.exports = router