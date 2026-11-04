
// =====================================================
// GET DASHBOARD DATA
// =====================================================

const userModel = require("../models/userModel");
const questionModel = require("../models/questionModel");
const dashboardSkillModel = require("../models/dashboardDataModel");

const userMernProgressModel = require("../models/userMernProgressModel");
const mernLearningContentModel = require("../models/preDefinedQuestionModel");

const DSA_TARGETS = {
    Array: 100,
    String: 80,
    Recursion: 50,
    Tree: 80,
    Graph: 80,
    HashMap: 50
};


async function getDashboard(req, res) {

    try {

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }


        // =========================
        // USER
        // =========================

        const user = await userModel
            .findById(userId)
            .select("_id name username technologies")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const technologies = Array.isArray(user.technologies)
            ? user.technologies
            : [];


        // =========================
        // DSA DATA
        // =========================

        const dsaQuestions = await questionModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        const dsaCompleted = dsaQuestions.length;


        const dsaConfig = await dashboardSkillModel
            .findOne({ name: "DSA" })
            .lean();

        const dsaTotal = dsaConfig
            ? dsaConfig.total
            : 0;


        const dsaPercentage = dsaTotal > 0
            ? Number(((dsaCompleted / dsaTotal) * 100).toFixed(2))
            : 0;


        // =========================
        // SKILLS
        // =========================

        const skills = [];


        // DSA

        skills.push({
            name: "DSA",
            completed: dsaCompleted,
            total: dsaTotal,
            percentage: dsaPercentage
        });


        // =========================
        // MERN
        // =========================

        if (technologies.includes("MERN")) {

            const progress =
                await userMernProgressModel
                    .find({ userId })
                    .sort({ updatedAt: -1 })
                    .lean();


            const learningContent =
                await mernLearningContentModel
                    .find({})
                    .lean();


            const total =
                learningContent.reduce((sum, item) => {

                    if (!Array.isArray(item.Topics)) {
                        return sum;
                    }

                    return sum + item.Topics.length;

                }, 0);


            const completed =
                progress.filter(
                    item => item.status === "completed"
                ).length;


            const percentage = total > 0
                ? Number(((completed / total) * 100).toFixed(2))
                : 0;


            skills.push({
                name: "MERN",
                completed,
                total,
                percentage
            });
        }


        // =========================
        // OVERALL PROGRESS
        // =========================

        let totalCompleted = 0;
        let totalLearningItems = 0;


        skills.forEach(skill => {

            totalCompleted += skill.completed;
            totalLearningItems += skill.total;

        });


        const overallPercentage =
            totalLearningItems > 0
                ? Number(
                    (
                        (totalCompleted / totalLearningItems) * 100
                    ).toFixed(2)
                )
                : 0;


        // =========================
        // CURRENT STREAK
        // =========================

        const activityDates = new Set();

        dsaQuestions.forEach(question => {

            const date = new Date(question.createdAt);

            const dateString = date.toISOString().split("T")[0];

            activityDates.add(dateString);

        });


        // MERN activity

        if (technologies.includes("MERN")) {

            const mernProgress =
                await userMernProgressModel
                    .find({ userId })
                    .select("updatedAt")
                    .lean();


            mernProgress.forEach(item => {

                const date = new Date(item.updatedAt);

                const dateString =
                    date.toISOString().split("T")[0];

                activityDates.add(dateString);

            });
        }


        let currentStreak = 0;

        const today = new Date();

        today.setHours(0, 0, 0, 0);


        let checkDate = new Date(today);


        // If user did not study today,
        // allow yesterday to continue the streak.

        const todayString =
            checkDate.toISOString().split("T")[0];


        if (!activityDates.has(todayString)) {

            checkDate.setDate(
                checkDate.getDate() - 1
            );

        }


        while (true) {

            const dateString =
                checkDate.toISOString().split("T")[0];


            if (!activityDates.has(dateString)) {
                break;
            }


            currentStreak++;


            checkDate.setDate(
                checkDate.getDate() - 1
            );
        }


        // =========================
        // RECENT ACTIVITY
        // =========================

        const recentActivity = [];


        // DSA activity

        dsaQuestions.slice(0, 10).forEach(question => {

            recentActivity.push({

                type: "DSA",

                title: question.questionName,

                topic: question.topic,

                status: "completed",

                createdAt: question.createdAt

            });

        });


        // MERN activity

        if (technologies.includes("MERN")) {

            const mernProgress =
                await userMernProgressModel
                    .find({ userId })
                    .sort({ updatedAt: -1 })
                    .limit(10)
                    .lean();


            mernProgress.forEach(item => {

                recentActivity.push({

                    type: "MERN",

                    title: item.topicName,

                    topic: "MERN",

                    status: item.status,

                    createdAt: item.updatedAt

                });

            });
        }


        // Latest activities first

        recentActivity.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );


        const finalRecentActivity =
            recentActivity.slice(0, 10);


        // =========================
        // WEAK TOPICS
        // =========================

        const topicCounts = {};


        Object.keys(DSA_TARGETS).forEach(topic => {

            topicCounts[topic] = 0;

        });


        dsaQuestions.forEach(question => {

            if (
                question.topic &&
                topicCounts.hasOwnProperty(question.topic)
            ) {

                topicCounts[question.topic]++;

            }

        });


        const weakTopics = Object.entries(DSA_TARGETS)
            .map(([topic, target]) => {

                const completed =
                    topicCounts[topic] || 0;


                const percentage =
                    target > 0
                        ? Number(
                            (
                                (completed / target) * 100
                            ).toFixed(2)
                        )
                        : 0;


                return {

                    topic,

                    completed,

                    total: target,

                    percentage

                };

            })
            .sort(
                (a, b) =>
                    a.percentage - b.percentage
            )
            .slice(0, 3);


        // =========================
        // RESPONSE
        // =========================

        return res.status(200).json({

            success: true,


            user: {

                id: user._id,

                name: user.name,

                username: user.username,

                technologies

            },


            stats: {

                questionsSolved: dsaCompleted,

                totalQuestions: dsaTotal,

                questionPercentage: dsaPercentage,

                currentStreak

            },


            skills,


            overall: {

                percentage: overallPercentage,

                breakdown: skills.map(skill => ({

                    name: skill.name,

                    completed: skill.completed,

                    total: skill.total,

                    percentage: skill.percentage

                }))

            },


            recentActivity:
                finalRecentActivity,


            weakTopics

        });


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to fetch dashboard",

            error: error.message

        });

    }

}



module.exports = {
    getDashboard
};