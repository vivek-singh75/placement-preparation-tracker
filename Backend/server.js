const app = require("./src/app");
const dotenv = require("dotenv").config()
const connectDB= require("./src/db/db")

connectDB()

PORT = process.env.PORT


app.listen(PORT , ()=>{
    console.log(`server is running on ${PORT}`)
});