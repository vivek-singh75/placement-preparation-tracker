const express = require("express");
const Users= require('./routes/registerUserR');
const cors = require("cors");
const app = express()

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(express.json()); 

app.use('/api/user', Users)
app.use('/api/user', Users)



module.exports = app