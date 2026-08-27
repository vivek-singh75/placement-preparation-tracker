const mongoose = require("mongoose");
const users = require("./userModel")

const questinSchema = new mongoose.Schema({
  
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
   questionName: {
        type: String,
        required : true
    },
    topic:{
        type: String,
        enum : ['Array', 'String', 'Recursion' , 'Tree', 'Graph', 'HashMap' , 'Other'],
    },
    Difficulty_Level:{
        type: String,
        enum : ['Easy', 'Medium', 'Hard'],
    },
    Platform:{
        type: String,
        enum : ['Self Study', 'LeetCode', 'Hackathon' , 'GeeksForGeeks', 'CodeChef', 'HackerRank'],
    },
    Solved_Status:{
        type: String,
        enum : ['First Time', 'Second Time', 'Third Time or More' ],
        default : "First Time"
    },
},{createdAt: true});

const questionModel = mongoose.model("question" , questinSchema);

module.exports = questionModel;