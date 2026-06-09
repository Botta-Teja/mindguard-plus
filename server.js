const dotenv = require("dotenv");
dotenv.config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Models
const User = require("./models/User");
const Joke = require("./models/Joke");
const Quote = require("./models/Quote");

// Middleware
const protect = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");
const moodRoutes = require("./routes/moodRoutes");
const goalRoutes = require("./routes/goalRoutes");

// 🔥 Scheduler
require("./services/goalScheduler");

// ✅ CREATE APP FIRST
const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// ================= CONNECT DB =================
connectDB();

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/goals", goalRoutes); // ✅ FIXED POSITION

// ================= HOME =================
app.get("/", (req, res) => {
    console.log("🏠 HOME ROUTE HIT");
    res.send("MindGuard+ Server Running Successfully");
});
// ================= PROFILE =================
app.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        res.json({ message: "Profile fetched successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// ================= ADD CONTACT =================
app.post("/add-contact", protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user);
        user.emergencyContacts.push({ name, email });

        await user.save();

        res.json({
            message: "Emergency contact added successfully",
            emergencyContacts: user.emergencyContacts
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding contact",
            error: error.message
        });
    }
});

// ================= ADD JOKE =================
app.post("/add-joke", async (req, res) => {
    try {
        const { text, category } = req.body;

        const newJoke = new Joke({ text, category });
        await newJoke.save();

        res.json({
            message: "Joke added successfully",
            joke: newJoke
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding joke",
            error: error.message
        });
    }
});

// ================= ADD QUOTE =================
app.post("/add-quote", async (req, res) => {
    try {
        const { text, author, category } = req.body;

        const newQuote = new Quote({ text, author, category });
        await newQuote.save();

        res.json({
            message: "Quote added successfully",
            quote: newQuote
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding quote",
            error: error.message
        });
    }
});

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});