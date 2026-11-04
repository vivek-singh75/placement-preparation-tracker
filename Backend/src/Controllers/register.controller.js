const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { response } = require("express");
//const emailService = require("../services/emailServices")




async function registerUser(req, res) {

    const {
        name,
        username,
        email,
        password,
        confirmPassword,
        technologies
    } = req.body;

    const isUserAllreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAllreadyExist) {
        return res.status(400).json({
            message: "user allredy exist, Please login"
        });
    }

    if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
        return res.status(400).json({
            message: "Please select at least one technology"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords are not same"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        username,
        email,
        password: hash,
        technologies
    });

    console.log(user);

    const token = jwt.sign({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET_KEY);

    res.cookie("cookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(201).json({
        message: "User Created Successfully :)",
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            technologies: user.technologies
        }
    });

    console.log("user created");
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
            // httpOnly: true,     
            // secure: false,      //for testing perpuse only
            // sameSite: "lax"
            httpOnly: true,    //before deployement we have to use this in res.cookie
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

async function updateUserData(req, res) {
    try {

        const userId = req.user?.id;

        const { name, technologies } = req.body;

        // Authentication check

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Name validation

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid name"
            });
        }

        // Technologies validation

        if (!Array.isArray(technologies) || technologies.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Select at least one technology"
            });
        }

        // Allowed technologies

        const allowedTechnologies = [
            "MERN",
            "Data Science",
            "AI/ML",
            "Spring Boot",
            "Cyber Security",
            "App Development"
        ];

        // Validate technology names

        const invalidTechnologies = technologies.filter(
            tech => !allowedTechnologies.includes(tech)
        );

        if (invalidTechnologies.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid technology selected",
                invalidTechnologies
            });
        }

        // Remove duplicate technologies

        const uniqueTechnologies = [...new Set(technologies)];

        // DSA is always included

        const finalTechnologies = [
            ...uniqueTechnologies
        ];

        // Update user

        const updatedData = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: name.trim(),
                    technologies: finalTechnologies
                }
            },
            {
                returnDocument : 'after',
                runValidators: true
            }
        ).select("-password");

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedData
        });

    } catch (error) { 

        console.error("Profile update error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

async function logoutUser(req, res) {
    try {

        const token = req.cookies.cookie;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not logged in"
            });
        }

        res.clearCookie("cookie", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error while logout"
        });

    }
}


module.exports = { registerUser , loginUser , fetchUserdata ,updateUserData,  logoutUser}