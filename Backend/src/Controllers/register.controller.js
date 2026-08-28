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
    
    res.cookie("cookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
        });

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
            httpOnly: true,
            secure: true,
            sameSite: "none"
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

async function fetchUserdata(req , res) {
    try {
        const token = req.cookies.cookie;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const userId = decoded.id;
        const user = await userModel
            .findById(userId)
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }
        res.status(200).json({
            message: "data fetched successfully",
            user
        })
    } catch (error) {
        console.log(`error while fetching profile data ${error}`);

        res.status(401).json({
            message: "Unauthorized access"
        });

    }
}


async function logoutUser(req, res) {

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        message: "logout successfully"
    });
}

module.exports = { registerUser , loginUser , fetchUserdata ,  logoutUser}