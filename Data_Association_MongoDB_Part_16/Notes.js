// ============================================
// 📘 MONGODB DATA ASSOCIATION NOTES
// ============================================
// This file contains notes and examples for MongoDB data association
// using Mongoose with Express.js

// ============================================
// 📦 Topic: Dependencies and Modules
// ============================================
// Required packages for this project:
// - express: Web framework for Node.js
// - mongoose: MongoDB ODM (Object Data Modeling) library

const express = require('express');
const mongoose = require('mongoose');

// ============================================
// 📊 Topic: MongoDB Connection
// ============================================
// Connecting to MongoDB using Mongoose
// The connection string format: mongodb://host:port/databaseName
// 127.0.0.1 is localhost, 27017 is MongoDB's default port

mongoose.connect("mongodb://127.0.0.1:27017/testingthedatabase");

// ============================================
// 📋 Topic: Mongoose Schema Definition
// ============================================
// Schemas define the structure of documents in a collection
// Each schema maps to a MongoDB collection

// 📌 User Schema - Defines user document structure
const userSchema = mongoose.Schema({
    username: String,       // User's name
    email: String,          // User's email
    age: Number,            // User's age
    posts: [                // Array of references to Post documents
        {
            type: mongoose.Schema.Types.ObjectId,  // MongoDB ObjectId type
            ref: 'post'     // References the 'post' model


            
        }
    ]
});

// 📌 Post Schema - Defines post document structure
const postSchema = mongoose.Schema({
    postdata: String,       // Content of the post
    user: {                 // Reference to User who created the post
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"         // References the 'user' model
    },
    date: {
        type: Date,
        default: Date.now() // Auto-set creation timestamp
    }
});

// ============================================
// 🏗️ Topic: Creating Models from Schemas
// ============================================
// Models are constructors compiled from Schema definitions
// They provide an interface to interact with the database

const userModel = mongoose.model('user', userSchema);
const postModel = mongoose.model('post', postSchema);

// ============================================
// 🌐 Topic: Express Application Setup
// ============================================
// Creating an Express application instance
const app = express();

// ============================================
// 🛤️ Topic: Basic Route Handler
// ============================================
// Simple GET route that responds with a message
// Route: GET /
app.get("/", function(req, res) {
    res.send("hey");
});

// ============================================
// 📝 Topic: Creating a User Document
// ============================================
// Async route handler to create a new user in MongoDB
// Uses async/await for handling promises

app.get("/create", async function(req, res) {
    // Create a new user document
    let user = await userModel.create({
        username: "podo",
        age: 25,
        email: "ppp@ppp.com"
    });
    
    // Send the created user as response
    res.send(user);
});

// ============================================
// 🔗 Topic: Data Association - One-to-Many Relationship
// ============================================
// Creating a post and associating it with a user
// This demonstrates how to link documents across collections

app.get("/post/create", async function(req, res) {
    // Step 1: Create a new post document
    let post = await postModel.create({
        postdata: "hello sare log kaise ho?",
        user: "68f303ad680fd18b9e29bff9",  // Reference to user's ObjectId
    });
    
    // Step 2: Find the user by their ObjectId
    let user = await userModel.findOne({_id: "68f303ad680fd18b9e29bff9"});
    
    // Step 3: Add the post's ObjectId to user's posts array
    user.posts.push(post._id);
    
    // Step 4: Save the updated user document
    await user.save();
    
    // Step 5: Send both post and user as response
    res.send({post, user});
});

// ============================================
// 🚀 Topic: Starting the Server
// ============================================
// Listen for incoming requests on port 3000
app.listen(3000);

// ============================================
// 📚 KEY CONCEPTS SUMMARY
// ============================================

// 1️⃣ MONGOOSE SCHEMA TYPES:
//    - String: Text data
//    - Number: Numeric values
//    - Date: Date/time values
//    - ObjectId: MongoDB's unique identifier
//    - Array: Collection of values

// 2️⃣ DATA ASSOCIATION PATTERNS:
//    - One-to-Many: One user can have many posts
//    - Reference: Store ObjectId to link documents
//    - ref: Specifies which model to reference

// 3️⃣ ASYNC/AWAIT PATTERN:
//    - async: Declares function returns a Promise
//    - await: Waits for Promise to resolve
//    - Better readability than .then() chains

// 4️⃣ MONGOOSE METHODS:
//    - create(): Creates and saves document
//    - findOne(): Finds single document by query
//    - save(): Saves changes to document

// 5️⃣ EXPRESS ROUTING:
//    - app.get(): Handles GET requests
//    - req: Request object (incoming data)
//    - res: Response object (outgoing data)

// ============================================
// 🔍 EXAMPLE: How Association Works
// ============================================

/*
USER DOCUMENT (in 'users' collection):
{
  _id: ObjectId("68f303ad680fd18b9e29bff9"),
  username: "podo",
  email: "ppp@ppp.com",
  age: 25,
  posts: [
    ObjectId("68f303ad680fd18b9e29bffa")  // Reference to post
  ]
}

POST DOCUMENT (in 'posts' collection):
{
  _id: ObjectId("68f303ad680fd18b9e29bffa"),
  postdata: "hello sare log kaise ho?",
  user: ObjectId("68f303ad680fd18b9e29bff9"),  // Reference to user
  date: 2025-10-18T10:30:00.000Z
}

This creates a bidirectional reference:
- User has array of Post IDs
- Post has reference to User ID
*/

// ============================================
// 💡 BEST PRACTICES
// ============================================

// ✅ Always use async/await for database operations
// ✅ Handle errors with try-catch blocks (not shown in original code)
// ✅ Validate data before saving to database
// ✅ Use meaningful variable names
// ✅ Close MongoDB connection when app terminates
// ✅ Use environment variables for connection strings
// ✅ Implement proper error handling in routes

// ============================================
// 🎯 NEXT STEPS TO IMPROVE THIS CODE
// ============================================

// 1. Add error handling:
/*
app.get("/create", async function(req, res) {
    try {
        let user = await userModel.create({...});
        res.send(user);
    } catch(error) {
        res.status(500).send({error: error.message});
    }
});
*/

// 2. Use populate() to fetch referenced documents:
/*
let user = await userModel.findOne({_id: "..."}).populate('posts');
// This will replace ObjectIds with actual post documents
*/

// 3. Add validation to schemas:
/*
const userSchema = mongoose.Schema({
    username: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 0, max: 120 }
});
*/
