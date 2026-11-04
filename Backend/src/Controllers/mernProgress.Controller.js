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

async function updateProgress(req, res) {
    try {
        const userId = req.user.id;
        const { topicId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["progress", "completed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid Status"
            });
        }

        // Find the topic from MERN learning content
        const learningContent = await mernQuestionModel.findOne({
            "Topics._id": topicId
        });

        if (!learningContent) {
            return res.status(404).json({
                message: "Topic not found"
            });
        }

        // Find the exact topic
        const topic = learningContent.Topics.id(topicId);

        if (!topic) {
            return res.status(404).json({
                message: "Topic not found"
            });
        }

        // Create or update user progress
        const progress = await userMernProgressModel.findOneAndUpdate(
            {
                userId,
                topicId
            },
            {
                userId,
                topicId,
                topicName: topic.title,
                status
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Progress updated successfully",
            progress
        });

    } catch (error) {
        console.log("Error updating progress:", error);

        return res.status(500).json({
            message: "Progress updation failed",
            error: error.message
        });
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

async function getMernAnalytics(req, res) {
    try {
        const userId = req.user.id;

        // Get user's MERN progress
        const progress = await userMernProgressModel.find({
            userId
        });

        // Get all MERN learning content
        const learningContent = await mernQuestionModel.find();

        // Calculate total topics from all documents
        const total = learningContent.reduce(
            (sum, item) => sum + item.Topics.length,
            0
        );

        // Calculate completed topics
        const completed = progress.filter(
            item => item.status === "completed"
        ).length;

        // Calculate percentage
        const percentage = total > 0
            ? Number(((completed / total) * 100).toFixed(2))
            : 0;

        return res.status(200).json({
            success: true,
            skill: {
                name: "MERN",
                completed,
                total,
                percentage
            }
        });

    } catch (error) {
        console.log("Error fetching MERN analytics:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch MERN analytics",
            error: error.message
        });
    }
}

module.exports= {fetchMernData, updateProgress , getProgress, getMernAnalytics }

