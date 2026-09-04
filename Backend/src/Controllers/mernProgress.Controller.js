const mernQuestionModel= require('../models/preDefinedQuestionModel');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const userMernProgressModel = require('../models/userMernProgressModel')

//this api fetch all technology and its subtopics
async function fetchMernData(req , res) {
    try {
        const learningContent =await mernQuestionModel.find()

        res.status(200).json({message: "data fetched successfully",
            learningContent
        })
        
    } catch (error) {
        console.log(`error in fetching data ${error}`)
        res.status(500).json({message: "error arrived"})
    }
}

async function updateProgress(req , res) {
    try {
        const userId = req.user.id
        const {topicId} = req.params;
        const {status} = req.body;

        if(!['progress' , 'completed'].includes(status)){
            return res.status(400).json({
                message : "Invalid Status"
            });
        }
        const progress = await userMernProgressModel.findOneAndUpdate(
            {
                userId,
                topicId
            },
            {
                status
            },
            {
                returnDocument: 'after',
                upsert: true
            }
        );

        res.status(200).json({
            message: "Progress updated successfully",
            progress
        });
    

    } catch (error) {
        res.status(400).json({
            message: "progress updation failed",
            error
        })
        console.log(`error updating progress ${error}`)
    }
   

}

async function getProgress(req , res) {
    try {
        const userId = req.user.id;
        const progress = await userMernProgressModel.find({userId});

        if (!progress || progress.length === 0) {
            return res.status(200).json({
                message: "No progress exists for this user",
                progress: []
            });
        }

        res.status(200).json({
            message : 'data fetched successfully',
            progress
        })
    } catch (error) {
        res.status(501).json({message : "error"})
        console.log(`error arrived ${error}`)
    }

}

module.exports= {fetchMernData, updateProgress , getProgress}

