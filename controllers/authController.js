const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= SIGNUP =================
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};


// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                moodStreak: user.moodStreak,
                emergencyContacts: user.emergencyContacts
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login error",
            error: error.message
        });
    }
};


module.exports = {
    signup,
    login
};
