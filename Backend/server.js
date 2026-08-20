const app = require("./src/app");
const dotenv = require("dotenv").config()
const connectDB= require("./src/db/db")

connectDB()
  
const PORT = process.env.PORT || 5000;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});