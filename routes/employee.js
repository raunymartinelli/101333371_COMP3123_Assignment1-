const express = require("express");
const mongoose= require('mongoose');
const router = express.Router();
const Employee = require("../models/Employee"); // Import your Mongoose model

// Middleware to check if the database is connected
const checkDatabaseConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res
            .status(200)
            .json({ status: false, message: "Database not connected." });
    }
    next();
};

// Route to create a new employee (Response Code: 201)
router.post("/api/v1/emp/employees", checkDatabaseConnection, async (req, res) => {
    try {
        // Extract employee data from the request body
        const { first_name, last_name, email, gender, salary } = req.body;

        // Check if an employee with the same email already exists
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res
                .status(400)
                .json({ status: false, message: "Email already in use" });
        }

        // If the email is unique, create a new employee instance
        const employee = new Employee({
            first_name,
            last_name,
            email,
            gender,
            salary,
        });

        // Save the employee to the database
        await employee.save();

        res
            .status(201)
            .json({ status: true, message: "Employee created successfully", data: employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

// Route to get all employees (Response Code: 200)
router.get("/api/v1/emp/employees", checkDatabaseConnection, async (req, res) => {
    try {
        const employees = await Employee.find();
        res
            .status(200)
            .json({ status: true, message: "Employees retrieved successfully", data: employees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

// Route to get an employee by ID (Response Code: 200)
router.get("/api/v1/emp/employees/:eid", checkDatabaseConnection, async (req, res) => {
    try {
        const employeeId = req.params.eid;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ status: false, message: "Employee not found" });
        }
        res
            .status(200)
            .json({ status: true, message: "Employee retrieved successfully", data: employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

// Route to update an employee by ID (Response Code: 200)
router.put("/api/v1/emp/employees/:eid", checkDatabaseConnection, async (req, res) => {
    try {
        const employeeId = req.params.eid;
        const { first_name, last_name, email, gender, salary } = req.body;

        const updateEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            {
                first_name,
                last_name,
                email,
                gender,
                salary,
            },
            { new: true }
        );

        if (!updateEmployee) {
            return res.status(400).json({ status: false, message: "Employee not found" });
        }
        res
            .status(200)
            .json({ status: true, message: "Employee updated successfully", data: updateEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

// Route to delete an employee by ID (Response Code: 204)
router.delete("/api/v1/emp/employees/:eid", checkDatabaseConnection, async (req, res) => {
    try {
        const employeeId = req.params.eid;

        const deleteEmployee = await Employee.findByIdAndDelete(employeeId);

        if (!deleteEmployee) {
            return res.status(404).json({ status: false, message: "Employee not found" });
        }
        res.status(204).json({status: true, message: "Employee has been deleted."});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});

module.exports = router;
