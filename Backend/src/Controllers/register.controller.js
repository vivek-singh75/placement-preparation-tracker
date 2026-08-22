const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req ,res) {
    const {name , username , email , password , confirmPassword} = req.body;

    const isUserAllreadyExist = await userModel.findOne({
        $or:[
            {username},
            {email}
    ]}); 

    if(isUserAllreadyExist){
        return res.status(400).json({message : "user allredy exist, Please login"});
    }
    if(password !== confirmPassword){
        return res.status(400).json({message : "Passwords are not same"})
    }
    const hash = await bcrypt.hash(password, 10);


    const user = userModel.create({
        name,
        username,
        email,
        password: hash,
    });

    const token = jwt.sign({
        id : user._id,
        name : user.name ,
        username : user.username,
        email : user.email
    },process.env.JWT_SECRET_KEY);
    
    res.cookie("cookie" ,token);

    res.status(201).json({
        message : "User Created Successfully :) ",
        user:{
            id : user._id,
            name : user.name,
            username: user.username,
            email : user.email,

        }
    });
    console.log("user created")
    
}


async function loginUser(req, res) {
    try {
        const {username , password } = req.body;

        const user = await userModel.findOne({
            username
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare( password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET_KEY
        );

        res.cookie("cookie", token, {
            httpOnly: true
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function logoutUser(req , res) {
    res.clearCookie("cookie");
    res.status(402).json({message : "logout successfully"})
}


module.exports = { registerUser , loginUser,  logoutUser}