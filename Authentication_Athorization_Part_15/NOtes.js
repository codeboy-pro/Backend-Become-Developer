// ==========================================
// BACKEND DAY 8 - AUTHENTICATION & AUTHORIZATION
// ==========================================
// Topics Covered:
// 1. Mongoose - MongoDB Object Modeling
// 2. Schema - Data Structure Definition
// 3. Model - Database Interface
// 4. User Registration - Password Hashing with bcrypt
// 5. JWT Token - Cookie-based Authentication
// 6. Login - Token Verification & Email Decryption
// ==========================================

/*
 * ==========================================
 * 1. MONGOOSE - MongoDB Object Modeling Tool
 * ==========================================
 * 
 * What is Mongoose?
 * - Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
 * - It provides a schema-based solution to model your application data
 * - It includes built-in type casting, validation, query building, and business logic hooks
 * 
 * Why use Mongoose?
 * - Schema validation
 * - Easy relationship management
 * - Middleware support (pre/post hooks)
 * - Query building and population
 * - Data type enforcement
 */

// Example: Connecting to MongoDB with Mongoose
const mongoose = require('mongoose');

// Connection string format: mongodb://host:port/database_name
mongoose.connect('mongodb://127.0.0.1:27017/authtestapp');

// Connection events
mongoose.connection.on('connected', () => {
    console.log('✓ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.log('✗ MongoDB connection error:', err);
});

/*
 * ==========================================
 * 2. SCHEMA - Defining Data Structure
 * ==========================================
 * 
 * What is a Schema?
 * - A Schema defines the structure of documents within a collection
 * - It specifies fields, data types, validation rules, and defaults
 * - Schemas are the blueprint for your data models
 * 
 * Schema Types Available:
 * - String, Number, Date, Buffer, Boolean
 * - Mixed, ObjectId, Array, Decimal128, Map
 */

// Example: Basic Schema Definition
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
});

// Example: Advanced Schema with Validation
const advancedUserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,           // Field is mandatory
        unique: true,             // Must be unique in collection
        trim: true,               // Remove whitespace
        minlength: 3,             // Minimum length
        maxlength: 30             // Maximum length
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,          // Convert to lowercase
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        min: 18,                  // Minimum value
        max: 120                  // Maximum value
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],  // Allowed values only
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now         // Auto timestamp
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profilePicture: {
        type: String,
        default: '/images/default-avatar.png'
    }
});

/*
 * ==========================================
 * 3. MODEL - Database Interface
 * ==========================================
 * 
 * What is a Model?
 * - A Model is a compiled version of the Schema
 * - It provides an interface to interact with the database
 * - Models are used to create, read, update, and delete documents
 * 
 * Model Methods:
 * - create()   : Create new document
 * - find()     : Find multiple documents
 * - findOne()  : Find single document
 * - findById() : Find by ID
 * - update()   : Update documents
 * - delete()   : Delete documents
 */

// Example: Creating a Model from Schema
const User = mongoose.model('user', userSchema);
// 'user' is the collection name (will become 'users' in MongoDB)

// Example: Using Model Methods

// 1. CREATE - Add new user to database
async function createUser() {
    const newUser = await User.create({
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashedpassword123',
        age: 25
    });
    console.log('User created:', newUser);
}

// 2. FIND ONE - Get single user
async function findUserByEmail(email) {
    const user = await User.findOne({ email: email });
    console.log('User found:', user);
    return user;
}

// 3. FIND ALL - Get multiple users
async function findAllUsers() {
    const users = await User.find({});
    console.log('All users:', users);
    return users;
}

// 4. FIND BY ID
async function findUserById(userId) {
    const user = await User.findById(userId);
    return user;
}

// 5. UPDATE - Modify existing document
async function updateUser(email, updates) {
    const user = await User.findOneAndUpdate(
        { email: email },
        updates,
        { new: true }  // Return updated document
    );
    return user;
}

// 6. DELETE - Remove document
async function deleteUser(email) {
    const result = await User.deleteOne({ email: email });
    console.log('Deleted:', result);
}

/*
 * ==========================================
 * 4. USER REGISTRATION - PASSWORD HASHING
 * ==========================================
 * 
 * What is Bcrypt?
 * - Bcrypt is a password hashing library
 * - It uses a salt to protect against rainbow table attacks
 * - It's intentionally slow to prevent brute-force attacks
 * 
 * Why Hash Passwords?
 * - Never store plain text passwords in database
 * - If database is compromised, passwords remain secure
 * - One-way encryption (cannot be reversed)
 * 
 * Hashing Process:
 * 1. Generate a salt (random data)
 * 2. Combine password with salt
 * 3. Hash the combination using bcrypt algorithm
 * 4. Store the hash (not the original password)
 */

const bcrypt = require('bcrypt');

// Example: Password Hashing during User Registration
async function registerUser(username, email, password, age) {
    
    // Step 1: Generate Salt
    // Salt Rounds = 10 (higher = more secure but slower)
    bcrypt.genSalt(10, (err, salt) => {
        
        if (err) {
            console.error('Error generating salt:', err);
            return;
        }
        
        console.log('Salt generated:', salt);
        
        // Step 2: Hash the password with the salt
        bcrypt.hash(password, salt, async (err, hash) => {
            
            if (err) {
                console.error('Error hashing password:', err);
                return;
            }
            
            console.log('Original password:', password);
            console.log('Hashed password:', hash);
            
            // Step 3: Store hashed password in database
            const createdUser = await User.create({
                username: username,
                email: email,
                password: hash,  // ← Store HASH, not plain password
                age: age
            });
            
            console.log('User created successfully:', createdUser);
            return createdUser;
        });
    });
}

// Alternative: Using Promises instead of Callbacks
async function registerUserWithPromises(username, email, password, age) {
    try {
        // Generate salt (10 rounds)
        const salt = await bcrypt.genSalt(10);
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user with hashed password
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            age
        });
        
        return user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Direct hashing without separate salt generation
async function quickHash(password) {
    const hash = await bcrypt.hash(password, 10);
    // 10 is the salt rounds, salt is generated automatically
    return hash;
}

/*
 * ==========================================
 * 5. JWT TOKEN - Cookie-based Authentication
 * ==========================================
 * 
 * What is JWT (JSON Web Token)?
 * - A compact, URL-safe token for transferring information
 * - Used for authentication and information exchange
 * - Consists of 3 parts: Header.Payload.Signature
 * 
 * JWT Structure:
 * - Header: Algorithm & token type
 * - Payload: Data (claims) - user info
 * - Signature: Verification code
 * 
 * Example JWT: eyJhbGc.eyJ1c2VySW.SflKxwRJ
 * 
 * Why use JWT?
 * - Stateless authentication (no server-side session storage)
 * - Scalable across multiple servers
 * - Can contain user data (email, role, etc.)
 * - Secure with secret key
 */

const jwt = require('jsonwebtoken');

// Secret key for signing tokens (should be in environment variables)
const SECRET_KEY = 'jsjsjsjsjjsjsjs';  // ⚠️ Use strong, unique secret in production

// Example: Creating JWT Token after User Registration
function createTokenOnRegister(email) {
    
    // jwt.sign(payload, secretKey, options)
    const token = jwt.sign(
        { email: email },           // Payload - data to encode
        SECRET_KEY,                 // Secret key for signing
        { expiresIn: '24h' }        // Optional: Token expires in 24 hours
    );
    
    console.log('Generated Token:', token);
    return token;
}

// Example: Complete Registration with Token & Cookie
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());  // Parse cookies from requests

app.post('/create', function(req, res) {
    let { username, email, password, age } = req.body;
    
    // Step 1: Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            
            // Step 2: Create user with hashed password
            let createdUser = await User.create({
                username,
                email,
                password: hash,  // Hashed password
                age
            });
            
            console.log('User created:', createdUser);
            
            // Step 3: Generate JWT token with user's email
            let token = jwt.sign({ email }, SECRET_KEY);
            
            // Step 4: Store token in cookie
            res.cookie('token', token, {
                httpOnly: true,      // Cookie not accessible via JavaScript
                secure: false,       // Set true in production (HTTPS)
                maxAge: 24*60*60*1000  // Cookie expires in 24 hours
            });
            
            // Step 5: Redirect to login page
            res.redirect('/login');
        });
    });
});

/*
 * ==========================================
 * 6. LOGIN - Token Verification & Decryption
 * ==========================================
 * 
 * Login Process:
 * 1. User submits email & password
 * 2. Find user by email in database
 * 3. Compare submitted password with stored hash
 * 4. If match, generate JWT token
 * 5. Store token in cookie
 * 6. Grant access to protected routes
 * 
 * Password Verification:
 * - bcrypt.compare() compares plain password with hash
 * - Returns true if match, false if not
 * 
 * Token Decryption:
 * - jwt.verify() decodes and validates the token
 * - Extracts payload data (email, etc.)
 */

// Example: Complete Login Implementation
app.post('/login', async function(req, res) {
    
    // Step 1: Get email and password from request
    let { email, password } = req.body;
    
    // Step 2: Find user by email in database
    let user = await User.findOne({ email: email });
    
    // Step 3: Check if user exists
    if (!user) {
        return res.send('User not found! Please register first.');
    }
    
    // Step 4: Compare submitted password with hashed password
    bcrypt.compare(password, user.password, function(err, result) {
        
        if (err) {
            console.error('Error comparing passwords:', err);
            return res.send('Login error occurred');
        }
        
        // Step 5: If passwords match
        if (result === true) {
            
            // Generate JWT token with user's email
            let token = jwt.sign(
                { email: user.email, userId: user._id },
                SECRET_KEY,
                { expiresIn: '7d' }  // Token valid for 7 days
            );
            
            // Store token in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,  // Set true in production
                maxAge: 7*24*60*60*1000  // 7 days
            });
            
            res.send('Login successful! Welcome back, ' + user.username);
            
        } else {
            // Passwords don't match
            res.send('Incorrect password! Please try again.');
        }
    });
});

/*
 * ==========================================
 * TOKEN VERIFICATION - Protected Routes
 * ==========================================
 * 
 * Middleware to verify JWT token from cookie
 * Used to protect routes that require authentication
 */

// Example: Authentication Middleware
function isLoggedIn(req, res, next) {
    
    // Step 1: Get token from cookie
    let token = req.cookies.token;
    
    // Step 2: Check if token exists
    if (!token) {
        return res.send('Access denied! Please login first.');
    }
    
    try {
        // Step 3: Verify and decode token
        let decoded = jwt.verify(token, SECRET_KEY);
        
        console.log('Decoded token data:', decoded);
        // decoded = { email: 'user@example.com', userId: '123...', iat: 1234567890, exp: 1234567890 }
        
        // Step 4: Attach user data to request object
        req.user = decoded;
        
        // Step 5: Continue to next middleware/route
        next();
        
    } catch (error) {
        // Token is invalid or expired
        console.error('Token verification failed:', error);
        return res.send('Invalid or expired token! Please login again.');
    }
}

// Example: Using Middleware in Protected Route
app.get('/profile', isLoggedIn, async function(req, res) {
    
    // req.user contains decoded token data (email, userId)
    let userEmail = req.user.email;
    
    // Fetch user details from database
    let user = await User.findOne({ email: userEmail });
    
    res.send(`
        <h1>Welcome to your profile, ${user.username}!</h1>
        <p>Email: ${user.email}</p>
        <p>Age: ${user.age}</p>
    `);
});

// Example: Dashboard - Only accessible when logged in
app.get('/dashboard', isLoggedIn, function(req, res) {
    res.send('Welcome to Dashboard! You are authenticated.');
});

/*
 * ==========================================
 * LOGOUT - Clearing Authentication
 * ==========================================
 * 
 * Logout Process:
 * 1. Clear the JWT token from cookie
 * 2. Redirect to login/home page
 */

// Example: Logout Route
app.get('/logout', function(req, res) {
    
    // Clear the token cookie by setting it to empty string
    res.cookie('token', '', {
        httpOnly: true,
        maxAge: 0  // Expire immediately
    });
    
    res.redirect('/');  // Redirect to home page
});

/*
 * ==========================================
 * COMPLETE AUTHENTICATION FLOW SUMMARY
 * ==========================================
 * 
 * REGISTRATION FLOW:
 * 1. User submits: username, email, password, age
 * 2. Password → bcrypt.genSalt() → bcrypt.hash() → hashed password
 * 3. User.create() → save to database with hashed password
 * 4. jwt.sign() → generate token with email
 * 5. res.cookie() → store token in browser cookie
 * 6. Redirect to login page
 * 
 * LOGIN FLOW:
 * 1. User submits: email, password
 * 2. User.findOne() → find user by email
 * 3. bcrypt.compare() → verify password against hash
 * 4. If match → jwt.sign() → generate new token
 * 5. res.cookie() → store token in cookie
 * 6. Redirect to dashboard/profile
 * 
 * PROTECTED ROUTE ACCESS:
 * 1. User visits protected route (e.g., /profile)
 * 2. Middleware checks req.cookies.token
 * 3. jwt.verify() → decode and validate token
 * 4. If valid → extract email → fetch user data
 * 5. Allow access to protected content
 * 
 * LOGOUT FLOW:
 * 1. User clicks logout
 * 2. res.cookie('token', '') → clear cookie
 * 3. Redirect to home/login page
 */

/*
 * ==========================================
 * SECURITY BEST PRACTICES
 * ==========================================
 * 
 * 1. NEVER store plain text passwords
 *    ✓ Always hash with bcrypt
 * 
 * 2. Use strong SECRET_KEY for JWT
 *    ✓ Store in environment variables (.env file)
 *    ✗ Don't hardcode in source code
 * 
 * 3. Set appropriate cookie options
 *    ✓ httpOnly: true (prevent XSS attacks)
 *    ✓ secure: true (HTTPS only in production)
 *    ✓ sameSite: 'strict' (CSRF protection)
 * 
 * 4. Token Expiration
 *    ✓ Set reasonable expiry time (1h - 7d)
 *    ✓ Implement refresh token mechanism
 * 
 * 5. Validate user input
 *    ✓ Use schema validation
 *    ✓ Sanitize inputs to prevent injection
 * 
 * 6. Handle errors properly
 *    ✗ Don't reveal sensitive info in error messages
 *    ✓ Log errors for debugging
 * 
 * 7. Use HTTPS in production
 *    ✓ Encrypt data in transit
 * 
 * 8. Rate limiting
 *    ✓ Prevent brute force attacks on login
 */

/*
 * ==========================================
 * ENVIRONMENT VARIABLES SETUP
 * ==========================================
 */

// Install dotenv: npm install dotenv
require('dotenv').config();

// Create .env file:
// PORT=4000
// MONGODB_URI=mongodb://127.0.0.1:27017/authtestapp
// JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
// NODE_ENV=development

// Usage:
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// mongoose.connect(MONGODB_URI);
// jwt.sign(payload, JWT_SECRET);

/*
 * ==========================================
 * ADDITIONAL USEFUL CODE SNIPPETS
 * ==========================================
 */

// Password strength validation (before hashing)
function isStrongPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate random token for password reset
const crypto = require('crypto');
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

// ==========================================
// END OF NOTES - BACKEND DAY 8
// ==========================================
