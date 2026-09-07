const mongoose = require("mongoose");


// =========================================
// DASHBOARD SKILL CONFIG
// =========================================

const dashboardSkillSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        icon: {
            type: String,
            default: ""
        },

        route: {
            type: String,
            default: "#"
        }
    },
    {
        timestamps: true
    }
);


const dashboardSkillModel =
    mongoose.model(
        "DashboardSkill",
        dashboardSkillSchema
    );


module.exports =  dashboardSkillModel;


/**
 * {
    "success": true,

    "stats": {
        "questionsSolved": 197,
        "totalQuestions": 4000,
        "questionPercentage": 4.93,
        "currentStreak": 12
    },

  * "skills": [
        {
            "name": "DSA",
            "completed": 197,
            "total": 4000,
            "percentage": 4.93
        },
        {
            "name": "MERN Stack",
            "completed": 18,
            "total": 90,
            "percentage": 20
        },
        {
            "name": "Data Science",
            "completed": 6,
            "total": 60,
            "percentage": 10
        },
        {
            "name": "Java / Spring Boot",
            "completed": 0,
            "total": 80,
            "percentage": 0
        },
        {
            "name": "Cyber Security",
            "completed": 0,
            "total": 70,
            "percentage": 0
        },
        {
            "name": "App Development",
            "completed": 0,
            "total": 60,
            "percentage": 0
        }
    ],

    "overall": {
        "percentage": 19,

        "breakdown": [
            {
                "name": "DSA",
                "percentage": 4.93
            },
            {
                "name": "MERN Stack",
                "percentage": 20
            },
            {
                "name": "Data Science",
                "percentage": 10
            }
        ]
    },

    "recentActivity": [],

    "weakTopics": []
}
 */
