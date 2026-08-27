const questionModel = require('../models/questionModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');


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

async function getQuestion(req, res) {
    try {
        const token = req.cookies.cookie;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const userId = decoded.id;
        const user = await userModel
            .findById(userId)
            .select("name email");
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }
        const userQuestionData = await questionModel.find(
            { userId: userId },
            {
                questionName: 1,
                topic: 1,
                Difficulty_Level: 1,
                Platform: 1,
                Solved_Status: 1,
                _id: 0
            }
        );
        const allData = {
            user,
            userQuestionData
        };
        return res.status(200).json({
            message: "Question data fetched",
            allData
        });
    } catch (error) {
        console.log("Error while finding user:", error);
        return res.status(401).json({
            message: "Unauthorized or invalid token"
        });
    }
}
 
 
module.exports = {addQuestion , getQuestion}