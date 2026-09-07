const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

// importing api 

const Users = require("./routes/registerUserR");
const questions = require("./routes/questionsR");
const dashboardData = require("./routes/dashboardDataRoutes");
const mernProgress = require("./routes/mernProgressRoutes");



const app = express();

app.use(cookieParser());

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://vivek-singh75.github.io"
];
 
// cors(cross origin resorce sharing )used backend to communicate with frontend in diffenrt origin

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

// Creating api

app.use("/api/user", Users);

app.use("/api/question", questions);

app.use("/api/mern" ,  mernProgress);

app.use("/api" , dashboardData)


module.exports = app;