const mongoose = require('mongoose');
const dns = require('dns');
 
dns.setServers(["8.8.8.8" , "4.4.8.8"])

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.log("error arrived while connecting to Database" + error);
    }
     
    
}

module.exports= connectDB