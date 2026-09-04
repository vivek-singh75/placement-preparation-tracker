/**
 * this file was only used to add data in the database 
 * this file has data of mern stack we can use this file to add more data we only have to write data 
 * 
 * COMMAND TO RUN THIS FILE = ( npm run seed )
 * WE have to ensure that this file not run again it runs only when we have to add data in database
 * if we run this file without changing same data like models, data, etc then it delete all users mern  data 
 * and and mern data from database and add new data with new _id 
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB  = require('../db/db');
const mernLearningContent = require('../models/preDefinedQuestionModel');


const data = [
  {
    "technology": "JavaScript",
    "Topics": [
      { "title": "JavaScript Basics" },
      { "title": "Functions & Scope" },
      { "title": "Arrays & Objects" },
      { "title": "DOM & Events" },
      { "title": "ES6+ Features" },
      { "title": "Asynchronous JavaScript" },
      { "title": "OOP & Prototypes" },
      { "title": "Advanced JavaScript" }
    ]
  },
  {
    "technology": "React.js",
    "Topics": [
      { "title": "React Fundamentals" },
      { "title": "Components & Props" },
      { "title": "State & Events" },
      { "title": "Forms & Validation" },
      { "title": "React Hooks" },
      { "title": "React Router" },
      { "title": "API Integration" },
      { "title": "State Management" }
    ]
  },
  {
    "technology": "Node.js",
    "Topics": [
      { "title": "Node.js Fundamentals" },
      { "title": "Modules & NPM" },
      { "title": "File System & Core Modules" },
      { "title": "Asynchronous Node.js" },
      { "title": "Event Loop & Events" },
      { "title": "HTTP & REST APIs" },
      { "title": "Streams & Buffers" },
      { "title": "Node.js Security" }
    ]
  },
  {
    "technology": "Express.js",
    "Topics": [
      { "title": "Express Fundamentals" },
      { "title": "Routing" },
      { "title": "Middleware" },
      { "title": "Request & Response" },
      { "title": "REST APIs" },
      { "title": "Authentication" },
      { "title": "Validation & Error Handling" },
      { "title": "Express Best Practices" }
    ]
  },
  {
    "technology": "MongoDB",
    "Topics": [
      { "title": "MongoDB Fundamentals" },
      { "title": "Databases & Collections" },
      { "title": "CRUD Operations" },
      { "title": "Queries & Operators" },
      { "title": "Schema Design" },
      { "title": "Indexes & Performance" },
      { "title": "Aggregation" },
      { "title": "MongoDB Security" }
    ]
  },
  {
    "technology": "Mongoose",
    "Topics": [
      { "title": "Mongoose Fundamentals" },
      { "title": "Schemas & Models" },
      { "title": "CRUD Operations" },
      { "title": "Validation" },
      { "title": "Queries & Pagination" },
      { "title": "Relationships & Populate" },
      { "title": "Middleware & Hooks" },
      { "title": "Mongoose Optimization" }
    ]
  },
  {
    "technology": "MERN Stack",
    "Topics": [
      { "title": "MERN Architecture" },
      { "title": "Project Setup" },
      { "title": "Frontend & Backend Integration" },
      { "title": "Authentication & Authorization" },
      { "title": "CRUD Application" },
      { "title": "File Upload & Search" },
      { "title": "Security & Error Handling" },
      { "title": "Deployment" }
    ]
  }
]

const learningData= async ()=>{
    try {
        await connectDB();

        await mernLearningContent.deleteMany({})

        await mernLearningContent.insertMany(data);

        console.log("data added successfully");

        await mongoose.connection.close();
    } catch (error) {
        console.log(`error while adding learning content ${error}`)
    }
}


learningData()

