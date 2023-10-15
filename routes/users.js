const express = require("express");
const UserModel = require("../models/Users");
const userRoutes = express.Router();
const mongoose = require("mongoose");

// Route to create a new user account (Response Code: 201)
userRoutes.post("/api/v1/user/signup", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            res.status(201).json({
                status: "true",
                message: "Database not connected."
            });
        } else {
            const newUser = new UserModel({
                ...req.body
            });
            await newUser.save();
            res.status(201).json({
                status: "true",
                message: "Account created."
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "false",
            message: error.message
        });
    } finally {
        // Disconnect from MongoDB when the request is complete
        mongoose.disconnect();
    }
});

// Route to handle user login (Response Code: 200)
userRoutes.post("/api/v1/user/login", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            res.status(200).json({
                message: "Database not Connected",
                providedCredentials: {
                    username,
                    password
                }
            });
        } else {
            const { username, password } = req.body;
            const user = await UserModel.findOne({ username });

            if (user && user.password === password) {
                res.status(200).json({
                    status: "true",
                    username: user.username,
                    message: "User logged in successfully."
                });
            } else {
                res.status(500).json({
                    status: "false",
                    message: "Invalid Username or password",
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            status: "false",
            message: error.message
        });
    } finally {
        // Disconnect from MongoDB when the request is complete
        mongoose.disconnect();
    }
});

module.exports = userRoutes;
