const questionModel = require("../models/questionModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


async function addQuestion(req , res) {
    const token = req.cookies.cookie

    const {questionName, topic, Difficulty_Level, Platform, Solved_Status } =req.body
    if(!token){
        return res.status(401).json({message : "Unauthorized access"})
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
        const question = await questionModel.create({
            userId: decoded.id,
            questionName,
            topic , 
            Difficulty_Level, 
            Platform, 
            Solved_Status
        });

        const populatedQuestion = await questionModel
            .findById(question._id)
            .populate("userId", "name username");

        res.status(201).json({
            message : "question added successfully",
            // question :{
            //     questionName: question.questionName,
            //     topic: question.topic ,  
            //     Difficulty_Level:  question.Difficulty_Level, 
            //     Platform : question.Platform, 
            //     Solved_Status: question.Solved_Status
            // },
            populatedQuestion

        })
        console.log("Question added successfully")
    } catch (error) {
        console.log(`error while creating model ${error}`)
    }
    
    
     
}
 
 
module.exports = {addQuestion}