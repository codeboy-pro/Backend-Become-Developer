// ==========================================
// BACKEND DAY 4 - NOTES
// Topics: Form Handling, Cookies, Sessions, Error Handling
// ==========================================

/* 
 * TABLE OF CONTENTS:
 * 1. Form Handling in Express
 * 2. Understanding Middleware (express.json() & express.urlencoded())
 * 3. Cookies - Storing Data in Browser
 * 4. Sessions - Server-side State Management
 * 5. Error Handling in Express
 * 6. Complete Examples
 */

// ==========================================
// 1. FORM HANDLING IN EXPRESS
// ==========================================

/*
 * WHAT IS FORM HANDLING?
 * - Process of receiving and processing data sent from frontend forms
 * - Frontend can be: HTML forms, React, Angular, Vue, or any framework
 * - Backend receives this data and processes it
 * 
 * WHY NEEDED?
 * - User registration, login, data submission
 * - Backend needs to parse and validate incoming data
 */

const express = require('express');
const app = express();

// Example 1: Basic Form Handling Setup
// -------------------------------------

// Middleware to parse JSON data (from fetch, axios, etc.)
app.use(express.json());

// Middleware to parse URL-encoded data (from HTML forms)
app.use(express.urlencoded({ extended: true }));

/*
 * express.json() - Parses JSON data from request body
 * express.urlencoded() - Parses form data (application/x-www-form-urlencoded)
 * extended: true - Allows nested objects in form data
 */


// Example 2: Handling Form Submission
// ------------------------------------

// GET route - Display form
app.get('/form', (req, res) => {
    res.send(`
        <form action="/submit-form" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Submit</button>
        </form>
    `);
});

// POST route - Process form data
app.post('/submit-form', (req, res) => {
    // req.body contains form data because of express.urlencoded()
    const { username, email, password } = req.body;
    
    console.log('Received data:', req.body);
    
    // Process the data (save to database, validate, etc.)
    res.send(`Form submitted successfully! Welcome ${username}`);
});


// Example 3: Handling JSON Data (from Frontend JS)
// ------------------------------------------------

app.post('/api/register', (req, res) => {
    // When frontend sends: fetch('/api/register', { method: 'POST', body: JSON.stringify({...}) })
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ 
            error: 'All fields are required' 
        });
    }
    
    // Process registration
    res.status(201).json({ 
        message: 'User registered successfully',
        user: { username, email }
    });
});


// ==========================================
// 2. MIDDLEWARE - express.json() & express.urlencoded()
// ==========================================

/*
 * WHAT IS MIDDLEWARE?
 * - Functions that have access to req, res, and next
 * - Execute in order between request and response
 * - Can modify req, res objects or end the request-response cycle
 * 
 * WHY express.json()?
 * - When you send data as JSON from frontend (Content-Type: application/json)
 * - Parses JSON and makes it available in req.body
 * 
 * WHY express.urlencoded()?
 * - When you submit HTML form (Content-Type: application/x-www-form-urlencoded)
 * - Parses form data and makes it available in req.body
 * - extended: true allows rich objects and arrays (using qs library)
 * - extended: false uses querystring library (only strings and arrays)
 */

// Example: Without middleware (data won't be parsed)
// req.body would be undefined

// With middleware:
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form data


// ==========================================
// 3. COOKIES - CLIENT-SIDE STORAGE
// ==========================================

/*
 * WHAT ARE COOKIES?
 * - Small pieces of data stored in the browser
 * - Sent automatically with every HTTP request to the same domain
 * - Used for: authentication, tracking, user preferences
 * 
 * HOW IT WORKS?
 * - Server sends cookie to browser using Set-Cookie header
 * - Browser stores it and sends it back with every request
 * - Cookie has: name, value, expiration, domain, path
 */

const cookieParser = require('cookie-parser');

// Middleware to parse cookies from request
app.use(cookieParser());


// Example 1: Setting a Cookie
// ---------------------------

app.get('/set-cookie', (req, res) => {
    // Basic cookie (expires when browser closes)
    res.cookie('username', 'JohnDoe');
    
    // Cookie with options
    res.cookie('sessionId', 'abc123', {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        httpOnly: true,   // Cannot be accessed by JavaScript (XSS protection)
        secure: true,     // Only sent over HTTPS
        sameSite: 'strict' // CSRF protection
    });
    
    res.send('Cookies set successfully!');
});


// Example 2: Reading Cookies
// --------------------------

app.get('/get-cookie', (req, res) => {
    // req.cookies contains all cookies (because of cookie-parser)
    const username = req.cookies.username;
    const sessionId = req.cookies.sessionId;
    
    if (username) {
        res.send(`Welcome back, ${username}! SessionID: ${sessionId}`);
    } else {
        res.send('No cookies found');
    }
});


// Example 3: Deleting a Cookie
// ----------------------------

app.get('/clear-cookie', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('sessionId');
    res.send('Cookies cleared!');
});


// Example 4: Practical Use - Remember Me Feature
// ----------------------------------------------

app.post('/login', (req, res) => {
    const { username, password, rememberMe } = req.body;
    
    // Validate credentials (check database)
    if (username === 'admin' && password === 'password123') {
        
        if (rememberMe) {
            // Set cookie for 30 days
            res.cookie('user', username, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
        } else {
            // Session cookie (expires when browser closes)
            res.cookie('user', username, { httpOnly: true });
        }
        
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});


// ==========================================
// 4. SESSIONS - SERVER-SIDE STATE MANAGEMENT
// ==========================================

/*
 * WHAT ARE SESSIONS?
 * - Server-side storage of user data
 * - More secure than cookies (data stored on server)
 * - Browser only stores session ID in a cookie
 * 
 * COOKIES vs SESSIONS:
 * 
 * COOKIES:
 * - Stored in browser
 * - Less secure (can be modified)
 * - Limited size (4KB)
 * - Good for: preferences, tracking
 * 
 * SESSIONS:
 * - Stored on server
 * - More secure (data on server)
 * - No size limit
 * - Good for: authentication, sensitive data
 * 
 * HOW SESSIONS WORK?
 * 1. User logs in
 * 2. Server creates session with unique ID
 * 3. Server sends session ID to browser as cookie
 * 4. Browser sends session ID with every request
 * 5. Server looks up session data using session ID
 */

const session = require('express-session');

// Session middleware setup
app.use(session({
    secret: 'your-secret-key-here', // Used to sign session ID cookie
    resave: false,                  // Don't save session if not modified
    saveUninitialized: false,       // Don't create session until something stored
    cookie: { 
        maxAge: 60 * 60 * 1000,     // 1 hour
        httpOnly: true,
        secure: false                // Set to true in production with HTTPS
    }
}));


// Example 1: Creating a Session on Login
// --------------------------------------

app.post('/session-login', (req, res) => {
    const { username, password } = req.body;
    
    // Validate credentials
    if (username === 'admin' && password === 'password123') {
        // Store data in session
        req.session.userId = 1;
        req.session.username = username;
        req.session.role = 'admin';
        req.session.isLoggedIn = true;
        
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});


// Example 2: Accessing Session Data
// ---------------------------------

app.get('/dashboard', (req, res) => {
    // Check if user is logged in
    if (req.session.isLoggedIn) {
        res.send(`
            <h1>Welcome to Dashboard, ${req.session.username}!</h1>
            <p>Role: ${req.session.role}</p>
            <p>User ID: ${req.session.userId}</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.status(401).send('Please login first!');
    }
});


// Example 3: Protected Route with Session
// ---------------------------------------

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        next(); // User is logged in, proceed to route
    } else {
        res.status(401).json({ error: 'Please login first' });
    }
}

app.get('/profile', isAuthenticated, (req, res) => {
    res.json({
        username: req.session.username,
        userId: req.session.userId,
        role: req.session.role
    });
});


// Example 4: Destroying Session (Logout)
// --------------------------------------

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not logout' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.send('Logged out successfully!');
    });
});


// Example 5: Shopping Cart with Sessions
// --------------------------------------

app.post('/add-to-cart', (req, res) => {
    const { productId, name, price } = req.body;
    
    // Initialize cart if not exists
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    // Add item to cart
    req.session.cart.push({ productId, name, price });
    
    res.json({ 
        message: 'Item added to cart',
        cart: req.session.cart
    });
});

app.get('/view-cart', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    res.json({ cart, total });
});


// ==========================================
// 5. ERROR HANDLING IN EXPRESS
// ==========================================

/*
 * WHAT IS ERROR HANDLING?
 * - Catching and responding to errors in application
 * - Prevents app from crashing
 * - Provides meaningful error messages to users
 * 
 * TYPES OF ERRORS:
 * 1. Synchronous errors - throw new Error()
 * 2. Asynchronous errors - next(error)
 * 3. 404 errors - Route not found
 * 4. Validation errors
 */


// Example 1: Basic Error Handling
// -------------------------------

app.get('/error-demo', (req, res, next) => {
    // Pass error to error handler
    return next(new Error('Something went wrong!'));
});


// Example 2: Async Error Handling
// -------------------------------

app.get('/async-error', async (req, res, next) => {
    try {
        // Simulate async operation
        const data = await someAsyncFunction();
        res.json(data);
    } catch (error) {
        next(error); // Pass error to error handler
    }
});


// Example 3: Custom Error Handler Middleware
// ------------------------------------------

/*
 * ERROR HANDLER MUST HAVE 4 PARAMETERS: (err, req, res, next)
 * Must be defined AFTER all other routes and middleware
 */

app.use((err, req, res, next) => {
    // Log error for debugging
    console.error('Error occurred:');
    console.error(err.stack);
    
    // Send error response
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Something broke!',
            status: err.status || 500
        }
    });
});


// Example 4: 404 Not Found Handler
// --------------------------------

// Catch all undefined routes (put before error handler)
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});


// Example 5: Custom Error Class
// -----------------------------

class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.isOperational = true;
    }
}

app.get('/user/:id', (req, res, next) => {
    const userId = req.params.id;
    
    // Simulate user not found
    if (userId !== '1') {
        return next(new AppError('User not found', 404));
    }
    
    res.json({ id: userId, name: 'John Doe' });
});


// ==========================================
// 6. COMPLETE EXAMPLES
// ==========================================

// Example 1: Complete Authentication System
// -----------------------------------------

const completeApp = express();
completeApp.use(express.json());
completeApp.use(express.urlencoded({ extended: true }));
completeApp.use(cookieParser());
completeApp.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

// Mock user database
const users = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com' }
];

// Registration
completeApp.post('/register', (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        
        // Validation
        if (!username || !password || !email) {
            throw new AppError('All fields are required', 400);
        }
        
        // Check if user exists
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            throw new AppError('Username already exists', 409);
        }
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            username,
            password, // In real app, hash this!
            email
        };
        users.push(newUser);
        
        res.status(201).json({ 
            message: 'Registration successful',
            user: { id: newUser.id, username, email }
        });
    } catch (error) {
        next(error);
    }
});

// Login with session
completeApp.post('/complete-login', (req, res, next) => {
    try {
        const { username, password, rememberMe } = req.body;
        
        // Find user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }
        
        // Create session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isLoggedIn = true;
        
        // Set remember me cookie
        if (rememberMe) {
            res.cookie('rememberUser', user.username, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
        }
        
        res.json({ 
            message: 'Login successful',
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        next(error);
    }
});

// Protected profile route
completeApp.get('/complete-profile', (req, res, next) => {
    try {
        if (!req.session.isLoggedIn) {
            throw new AppError('Please login first', 401);
        }
        
        const user = users.find(u => u.id === req.session.userId);
        
        res.json({
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        next(error);
    }
});

// Logout
completeApp.post('/complete-logout', (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                throw new AppError('Could not logout', 500);
            }
            res.clearCookie('connect.sid');
            res.clearCookie('rememberUser');
            res.json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        next(error);
    }
});


// ==========================================
// KEY TAKEAWAYS & BEST PRACTICES
// ==========================================

/*
 * FORM HANDLING:
 * ✓ Always use express.json() for JSON data
 * ✓ Always use express.urlencoded() for form data
 * ✓ Validate all incoming data
 * ✓ Sanitize user input to prevent injection attacks
 * 
 * COOKIES:
 * ✓ Use httpOnly: true to prevent XSS attacks
 * ✓ Use secure: true in production (HTTPS only)
 * ✓ Set appropriate maxAge/expires
 * ✓ Use sameSite to prevent CSRF attacks
 * ✓ Don't store sensitive data in cookies
 * 
 * SESSIONS:
 * ✓ Use for authentication and sensitive data
 * ✓ Set strong secret key
 * ✓ Use session store (Redis, MongoDB) in production
 * ✓ Set appropriate session timeout
 * ✓ Always destroy session on logout
 * 
 * ERROR HANDLING:
 * ✓ Always use try-catch for async operations
 * ✓ Create custom error handler middleware
 * ✓ Log errors for debugging
 * ✓ Send appropriate HTTP status codes
 * ✓ Don't expose sensitive error details to users
 * ✓ Handle 404 errors separately
 * 
 * SECURITY:
 * ✓ Never store passwords in plain text (use bcrypt)
 * ✓ Use HTTPS in production
 * ✓ Implement rate limiting
 * ✓ Validate and sanitize all user input
 * ✓ Use environment variables for secrets
 */


// ==========================================
// COMMON MISTAKES TO AVOID
// ==========================================

/*
 * ❌ Forgetting to use express.json() or express.urlencoded()
 *    Result: req.body will be undefined
 * 
 * ❌ Not using cookie-parser before accessing req.cookies
 *    Result: req.cookies will be undefined
 * 
 * ❌ Placing error handler before routes
 *    Result: Error handler won't catch errors
 * 
 * ❌ Not using next(error) in async functions
 *    Result: Errors won't be caught
 * 
 * ❌ Storing sensitive data in cookies
 *    Result: Security vulnerability
 * 
 * ❌ Not setting httpOnly flag on cookies
 *    Result: Vulnerable to XSS attacks
 * 
 * ❌ Not destroying session on logout
 *    Result: Session data remains accessible
 * 
 * ❌ Using default session secret in production
 *    Result: Session can be hijacked
 */


// ==========================================
// TESTING YOUR CODE
// ==========================================

/*
 * TEST FORM HANDLING:
 * 1. Send POST request with JSON data
 * 2. Send POST request with form data
 * 3. Check req.body contains correct data
 * 
 * TEST COOKIES:
 * 1. Set cookie and verify in browser DevTools
 * 2. Send request and check if cookie is sent back
 * 3. Clear cookie and verify it's removed
 * 
 * TEST SESSIONS:
 * 1. Login and check session is created
 * 2. Access protected route with session
 * 3. Logout and verify session is destroyed
 * 
 * TEST ERROR HANDLING:
 * 1. Trigger errors and check response
 * 2. Access non-existent route (404)
 * 3. Send invalid data and check validation
 */


// ==========================================
// USEFUL PACKAGES
// ==========================================

/*
 * express-session - Session management
 * cookie-parser - Parse cookies
 * bcrypt - Password hashing
 * express-validator - Input validation
 * helmet - Security headers
 * cors - Cross-Origin Resource Sharing
 * morgan - HTTP request logger
 * dotenv - Environment variables
 * connect-redis - Redis session store
 * express-rate-limit - Rate limiting
 */


// Start server
// app.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });


// ==========================================
// END OF NOTES - BACKEND DAY 4
// ==========================================
