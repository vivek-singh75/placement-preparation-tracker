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
 
const TOPICS = [
    "Array",
    "String",
    "Recursion",
    "Tree",
    "Graph",
    "HashMap"
];

const DIFFICULTIES = [
    "Easy",
    "Medium",
    "Hard"
];

const DSA_TARGETS = {
    Array: 100,
    String: 80,
    Recursion: 50,
    Tree: 80,
    Graph: 80,
    HashMap: 50
};

const TARGET_DIFFICULTY_DISTRIBUTION = {
    Easy: 0.40,
    Medium: 0.40,
    Hard: 0.20
};


// =====================================================
// DSA ANALYTICS
// =====================================================

async function dsaAnalytics(req, res) {

    try {

        // ---------------------------------------------
        // Get logged-in user's ID
        // ---------------------------------------------

        const userId = req.user.id;

        if(!userId){
            return res.status(401).json({
                success: false,
                message : "Unauthorized Access"
            })
        }

        const user  = await userModel.findById({
            _id: userId
        }).select("_id name username ")


        // ---------------------------------------------
        // Get user's questions
        // ---------------------------------------------

        const questions = await questionModel.find({
            userId: userId
        }).lean();




        if(!questions){
            return res.status(401).json({
                success: false,
                message : "questions now availble"
            })
        }

        // ---------------------------------------------
        // Topic counts
        // ---------------------------------------------

        const topicCounts = {};

        TOPICS.forEach(topic => {
            topicCounts[topic] = 0;
        });


        questions.forEach(question => {

            if (topicCounts.hasOwnProperty(question.topic)) {
                topicCounts[question.topic]++;
            }

        });


        // ---------------------------------------------
        // Difficulty counts
        // ---------------------------------------------

        const difficultyCounts = {
            Easy: 0,
            Medium: 0,
            Hard: 0
        };


        questions.forEach(question => {

            if (
                difficultyCounts.hasOwnProperty(
                    question.Difficulty_Level
                )
            ) {

                difficultyCounts[
                    question.Difficulty_Level
                ]++;

            }

        });


        // ---------------------------------------------
        // Platform counts
        // ---------------------------------------------

        const platformCounts = {};

        questions.forEach(question => {

            const platform =
                question.Platform || "Other";

            if (!platformCounts[platform]) {
                platformCounts[platform] = 0;
            }

            platformCounts[platform]++;

        });


        // ---------------------------------------------
        // Topic Score
        // ---------------------------------------------

        let topicPercentageTotal = 0;


        TOPICS.forEach(topic => {

            const solved =
                topicCounts[topic];

            const target =
                DSA_TARGETS[topic];

            const percentage =
                Math.min(
                    (solved / target) * 100,
                    100
                );

            topicPercentageTotal += percentage;

        });


        const topicScore =
            TOPICS.length === 0
                ? 0
                : topicPercentageTotal / TOPICS.length;


        // ---------------------------------------------
        // Difficulty Score
        // ---------------------------------------------

        const totalSolved =
            questions.length;


        let difficultyScore = 0;


        if (totalSolved > 0) {

            const actualEasy =
                difficultyCounts.Easy /
                totalSolved;

            const actualMedium =
                difficultyCounts.Medium /
                totalSolved;

            const actualHard =
                difficultyCounts.Hard /
                totalSolved;


            const easyScore =
                Math.min(
                    actualEasy /
                    TARGET_DIFFICULTY_DISTRIBUTION.Easy,
                    1
                );


            const mediumScore =
                Math.min(
                    actualMedium /
                    TARGET_DIFFICULTY_DISTRIBUTION.Medium,
                    1
                );


            const hardScore =
                Math.min(
                    actualHard /
                    TARGET_DIFFICULTY_DISTRIBUTION.Hard,
                    1
                );


            difficultyScore =
                (
                    easyScore *
                    TARGET_DIFFICULTY_DISTRIBUTION.Easy
                ) +

                (
                    mediumScore *
                    TARGET_DIFFICULTY_DISTRIBUTION.Medium
                ) +

                (
                    hardScore *
                    TARGET_DIFFICULTY_DISTRIBUTION.Hard
                );


            difficultyScore *= 100;

        }


        // ---------------------------------------------
        // Final DSA Score
        // ---------------------------------------------

        const dsaScore =
            (
                topicScore * 0.60
            ) +

            (
                difficultyScore * 0.40
            );


        // ---------------------------------------------
        // Weak Topics
        // ---------------------------------------------

        const weakTopics = TOPICS
            .map(topic => {

                const solved =
                    topicCounts[topic];

                const target =
                    DSA_TARGETS[topic];

                const progress =
                    Math.min(
                        (solved / target) * 100,
                        100
                    );


                return {
                    topic,
                    solved,
                    target,
                    progress:
                        Number(progress.toFixed(2))
                };

            })
            .sort(
                (a, b) =>
                    a.progress - b.progress
            )
            .slice(0, 3);


        // ---------------------------------------------
        // Topic Progress
        // ---------------------------------------------

        const topicProgress =
            TOPICS.map(topic => {

                const solved =
                    topicCounts[topic];

                const target =
                    DSA_TARGETS[topic];

                const progress =
                    Math.min(
                        (solved / target) * 100,
                        100
                    );


                return {
                    topic,
                    solved,
                    target,
                    progress:
                        Number(progress.toFixed(2))
                };

            });


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        return res.status(200).json({

            success: true,
            user : user,

            data: {

                totalSolved,

                difficulty: {
                    Easy: difficultyCounts.Easy,
                    Medium: difficultyCounts.Medium,
                    Hard: difficultyCounts.Hard
                },

                topics: topicCounts,

                topicProgress,

                topicScore:
                    Number(
                        topicScore.toFixed(2)
                    ),

                difficultyScore:
                    Number(
                        difficultyScore.toFixed(2)
                    ),

                dsaScore:
                    Number(
                        dsaScore.toFixed(2)
                    ),

                weakTopics,

                platforms: platformCounts

            }

        });

    }

    catch (error) {

        console.error(
            "DSA Analytics Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to calculate DSA analytics",

            error:
                error.message

        });

    }

}

 
module.exports = {
    addQuestion , 
    getQuestion ,
    dsaAnalytics,
}