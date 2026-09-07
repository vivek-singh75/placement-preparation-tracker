const questionModel = require("../models/questionModel");
const mernQuestionModel = require("../models/preDefinedQuestionModel");
const userMernProgressModel = require("../models/userMernProgressModel");


// =====================================================
// GET DASHBOARD DATA
// =====================================================

async function getDashboard(req, res) {

    try {

        // =====================================================
        // LOGGED IN USER
        // =====================================================

        const userId = req.user.id;

        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "User not authenticated"

            });

        }


        // =====================================================
        // GET DSA QUESTIONS
        // =====================================================

        const questions =
            await questionModel
                .find({ userId })
                .sort({ createdAt: -1 })
                .lean();


        // =====================================================
        // GET MERN CURRICULUM
        // =====================================================

        /*
            Your preDefinedQuestionModel contains:

            technology
            Topics
                ├── _id
                ├── title
                └── ...

        */

        const learningContent =
            await mernQuestionModel
                .find({})
                .lean();


        // =====================================================
        // GET USER MERN PROGRESS
        // =====================================================

        const mernProgress =
            await userMernProgressModel
                .find({ userId })
                .sort({ updatedAt: -1 })
                .lean();


        // =====================================================
        // TOTAL DSA SOLVED
        // =====================================================

        const totalSolved =
            questions.length;


        // =====================================================
        // DSA TOTAL QUESTIONS
        // =====================================================

        const dsaTotal =
            500;


        // =====================================================
        // MERN TOTAL TOPICS
        // =====================================================

        let mernTotal = 0;


        learningContent.forEach(
            (technology) => {

                const topics =
                    technology.Topics || [];

                mernTotal +=
                    topics.length;

            }
        );


        // =====================================================
        // MERN COMPLETED
        // =====================================================

        const mernCompleted =
            mernProgress.filter(
                (item) =>
                    item.status === "completed"
            ).length;


        // =====================================================
        // DSA STREAK
        // =====================================================

        /*
            Example:

            Sep 7  -> solved
            Sep 6  -> solved
            Sep 5  -> solved
            Sep 4  -> not solved

            Streak = 3
        */

        function getISTDateString(date) {

            return new Intl.DateTimeFormat(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }
            ).format(
                new Date(date)
            );

        }


        // =====================================================
        // UNIQUE DSA SOLVING DAYS
        // =====================================================

        const solvedDates =
            new Set();


        questions.forEach(
            (question) => {

                if (!question.createdAt) {
                    return;
                }


                const date =
                    getISTDateString(
                        question.createdAt
                    );


                solvedDates.add(date);

            }
        );


        // =====================================================
        // TODAY
        // =====================================================

        const today =
            getISTDateString(
                new Date()
            );


        // =====================================================
        // CALCULATE STREAK
        // =====================================================

        let streak = 0;


        /*
            Streak starts only if user
            solved something today.
        */

        if (solvedDates.has(today)) {

            streak = 1;


            let currentDate =
                new Date(
                    `${today}T00:00:00+05:30`
                );


            while (true) {

                currentDate.setDate(
                    currentDate.getDate() - 1
                );


                const previousDate =
                    getISTDateString(
                        currentDate
                    );


                if (
                    solvedDates.has(
                        previousDate
                    )
                ) {

                    streak++;

                } else {

                    break;

                }

            }

        }


        // =====================================================
        // CREATE TOPIC MAP
        // =====================================================

        /*
            topicId
                ↓
            topic title
            technology
        */

        const topicMap = {};


        learningContent.forEach(
            (technology) => {

                const topics =
                    technology.Topics || [];


                topics.forEach(
                    (topic) => {

                        topicMap[
                            String(topic._id)
                        ] = {

                            title:
                                topic.title,

                            technology:
                                technology.technology

                        };

                    }
                );

            }
        );


        // =====================================================
        // DSA RECENT ACTIVITY
        // =====================================================

        const dsaActivities =
            questions.map(
                (question) => {

                    return {

                        id:
                            `dsa-${question._id}`,

                        type:
                            "DSA",

                        action:
                            "Solved",

                        title:
                            question.questionName ||
                            "Unnamed Question",

                        topic:
                            question.topic ||
                            null,

                        createdAt:
                            question.createdAt

                    };

                }
            );


        // =====================================================
        // MERN RECENT ACTIVITY
        // =====================================================

        const mernActivities =
            mernProgress
                .map(
                    (progress) => {

                        const topic =
                            topicMap[
                                String(
                                    progress.topicId
                                )
                            ];


                        // Topic doesn't exist
                        if (!topic) {

                            return null;

                        }


                        return {

                            id:
                                `mern-${progress._id}`,

                            type:
                                "MERN",

                            action:
                                progress.status ===
                                "completed"

                                    ? "Completed"

                                    : "In Progress",

                            title:
                                topic.title,

                            topic:
                                topic.technology,

                            createdAt:
                                progress.updatedAt

                        };

                    }
                )
                .filter(Boolean);


        // =====================================================
        // COMBINE ALL ACTIVITIES
        // =====================================================

        const allActivities = [

            ...dsaActivities,

            ...mernActivities

        ];


        // =====================================================
        // SORT LATEST FIRST
        // =====================================================

        allActivities.sort(
            (a, b) => {

                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );

            }
        );


        // =====================================================
        // LATEST 5
        // =====================================================

        const recentActivity =
            allActivities.slice(0, 5);


        // =====================================================
        // PREDEFINED SKILLS
        // =====================================================

        const skills = [

            // =================================================
            // DSA
            // =================================================

            {

                id:
                    "dsa",

                name:
                    "DSA",

                completed:
                    totalSolved,

                total:
                    dsaTotal,

                icon:
                    "</>",

                button:
                    "Go to DSA",

                link:
                    "../html/dashboardOfDsa.html"

            },


            // =================================================
            // MERN
            // =================================================

            {

                id:
                    "mern",

                name:
                    "MERN Stack",

                completed:
                    mernCompleted,

                total:
                    mernTotal,

                icon:
                    "M",

                button:
                    "Explore",

                link:
                    "../html/mern.html"

            },


            // =================================================
            // DATA SCIENCE
            // =================================================

            {

                id:"data-science",

                name:  "Data Science",

                completed:  0,

                total:  60,

                icon:  "DS",

                button: "Explore",

                link: "#"

            },


            // =================================================
            // JAVA
            // =================================================

            {

                id: "java",

                name:  "Java / Spring Boot",

                completed:  0,

                total:  80,

                icon: "☕",

                button: "Coming Soon",

                link:  "#"

            },


            // =================================================
            // CYBER SECURITY
            // =================================================

            {

                id: "cyber-security",

                name:  "Cyber Security",

                completed: 0,

                total:  70,

                icon:  "◈",

                button:"Coming Soon",

                link: "#"

            },


            // =================================================
            // APP DEVELOPMENT
            // =================================================

            {

                id: "app-development",

                name: "App Development",

                completed: 0,

                total: 60,

                icon:"▣",

                button:"Coming Soon",

                link:"#"

            }

        ];


        // =====================================================
        // FINAL RESPONSE
        // =====================================================

        return res.status(200).json({

            success:
                true,

            data: {

                // =============================================
                // DASHBOARD STATS
                // =============================================

                totalSolved,

                streak,


                // =============================================
                // SKILLS
                // =============================================

                skills,


                // =============================================
                // RECENT ACTIVITY
                // =============================================

                recentActivity

            }

        });


    } catch (error) {

        console.log(
            "Dashboard Error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Error while fetching dashboard data",

            error:
                error.message

        });

    }

}


module.exports = {
    getDashboard
};