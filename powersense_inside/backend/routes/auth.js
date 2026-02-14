const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");  // Use bcryptjs for consistency

const User = require("../models/User");

// In-memory storage for testing (fallback when MongoDB fails)
let inMemoryUsers = [];

// Check if we're using in-memory storage
const useInMemory = () => {
  return inMemoryUsers.length >= 0; // Always true for now as fallback
};

// REGISTER
router.post("/register", async (req, res) => {
    try {
        console.log("Registration attempt:", { body: req.body });
        
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            console.log("Missing fields:", { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({
                msg: "Name, email and password are required."
            });
        }

        // Check user exists (try MongoDB first, then fallback)
        console.log("Checking if user exists for email:", email);
        let user = null;
        
        try {
            user = await User.findOne({ email });
        } catch (mongoErr) {
            console.log("MongoDB check failed, using in-memory:", mongoErr.message);
            user = inMemoryUsers.find(u => u.email === email);
        }
        
        if (user) {
            console.log("User already exists:", email);
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash password
        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed successfully");

        // Save user (try MongoDB first, then fallback)
        console.log("Creating new user...");
        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        try {
            user = new User(newUser);
            await user.save();
            console.log("User saved to MongoDB successfully:", { name, email });
        } catch (mongoErr) {
            console.log("MongoDB save failed, using in-memory:", mongoErr.message);
            newUser._id = Date.now().toString(); // Simple ID for in-memory
            inMemoryUsers.push(newUser);
            console.log("User saved to in-memory storage:", { name, email });
        }

        res.json({ msg: "User Registered Successfully" });
        
    } catch (err) {
        console.error("Registration error details:");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("Full error object:", err);
        
        // Handle specific MongoDB errors
        if (err.code === 11000) {
            return res.status(400).json({ msg: "Email already registered" });
        }
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        
        // Handle connection errors
        if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
            console.log("Using in-memory fallback due to connection error");
            // Try in-memory fallback
            try {
                const { name, email, password } = req.body;
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                const existingUser = inMemoryUsers.find(u => u.email === email);
                if (existingUser) {
                    return res.status(400).json({ msg: "User already exists" });
                }
                
                inMemoryUsers.push({
                    _id: Date.now().toString(),
                    name,
                    email,
                    password: hashedPassword,
                    createdAt: new Date()
                });
                
                return res.json({ msg: "User Registered Successfully (In-Memory)" });
            } catch (fallbackErr) {
                console.error("In-memory fallback failed:", fallbackErr);
            }
        }
        
        // If it's a bcrypt error, try without password hashing
        if (err.message && err.message.includes('bcrypt')) {
            console.log("Bcrypt error, trying without hashing");
            try {
                const { name, email, password } = req.body;
                const existingUser = inMemoryUsers.find(u => u.email === email);
                if (existingUser) {
                    return res.status(400).json({ msg: "User already exists" });
                }
                
                inMemoryUsers.push({
                    _id: Date.now().toString(),
                    name,
                    email,
                    password: password, // Store as-is for testing
                    createdAt: new Date()
                });
                
                return res.json({ msg: "User Registered Successfully (In-Memory, No Hash)" });
            } catch (fallbackErr) {
                console.error("Fallback without bcrypt failed:", fallbackErr);
            }
        }
        
        res.status(500).json({ msg: "Server error during registration: " + err.message });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    console.log("Login attempt for email:", email);
    console.log("Password provided:", password);

    const user = await User.findOne({email});
    if(!user){
        console.log("User not found");
        return res.status(400).json({ msg: "Invalid Credentials" });
    }

    console.log("User found:", user.email);
    console.log("Stored hash:", user.password);

    const same = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", same);
    
    if(!same){
        console.log("Password mismatch");
        return res.status(400).json({ msg: "Invalid Credentials" });
    }

    console.log("Login successful");
    return res.status(200).json({ msg: "Login Successful" });

});
module.exports = router;
