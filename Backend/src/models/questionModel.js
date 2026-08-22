const mongoose = require("mongoose");
const users = require('./userModel')

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
        default :'Array'
    },
    Difficulty_Level:{
        type: String,
        enum : ['Easy', 'Medium', 'Hard'],
        default:"Easy"
    },
    Platform:{
        type: String,
        enum : ['Self Study', 'Leetcode', 'Hackathon' , 'GeeksForGeeks', 'CodeChef', 'HackerRank'],
        default: "Self Study"
    },
    Solved_Status:{
        type: String,
        enum : ['First Time', 'Second Time', 'Third Time or More' ],
        default : "First Time"
    },
});

const questionModel = mongoose.model("question" , questinSchema);

module.exports = questionModel;