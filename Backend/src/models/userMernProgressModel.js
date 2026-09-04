const mongoose = require("mongoose");

const userMernProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },

        topicId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        status: {
            type: String,
            enum: ["progress", "completed"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

userMernProgressSchema.index(
    { userId: 1, topicId: 1 },
    { unique: true }
);

const userMernProgressModel = mongoose.model(
    "UserMernProgress",
    userMernProgressSchema
);

module.exports = userMernProgressModel;