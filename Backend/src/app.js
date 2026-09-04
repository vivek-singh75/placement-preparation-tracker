const express = require("express");
const Users = require("./routes/registerUserR");
const cors = require("cors");
const questions = require("./routes/questionsR");
const cookieParser = require("cookie-parser");
const mernProgress = require("./routes/mernProgressRoutes");



const app = express();

app.use(cookieParser());

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://vivek-singh75.github.io"
];

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

app.use("/api/user", Users);

app.use("/api/question", questions);

app.use("/api/mern" ,  mernProgress);

module.exports = app;