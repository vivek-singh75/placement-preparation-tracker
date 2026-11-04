const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    technologies: {
        type: [{
            type: String,
            enum: [
                "MERN",
                "Spring Boot",
                "AI/ML",
                "Data Science",
                "Cyber Security",
                "App Development"
            ]
        }],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one technology must be selected"
        }
    }

}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;