const express = require('express');

const dashboardData = require("../Controllers/dashboardData.Controller");
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

router.get("/dashboard" , authMiddleware.authMiddleware , dashboardData.getDashboard);



module.exports = router

