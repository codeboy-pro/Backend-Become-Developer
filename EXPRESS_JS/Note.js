// ============================================================================
// DAY 2: EXPRESS.JS BACKEND DEVELOPMENT NOTES
// ============================================================================

/*
 * TOPIC 1: INTRODUCTION TO EXPRESS.JS
 * ====================================
 * 
 * What is Express.js?
 * - Express.js is a fast, minimalist web framework for Node.js
 * - It's an NPM package that simplifies building web applications and APIs
 * - Part of the MERN stack (MongoDB, Express, React, Node.js)
 * - Manages everything from receiving requests to sending responses
 * 
 * Why use Express.js?
 * - Simplifies HTTP server creation
 * - Provides robust routing mechanisms
 * - Built-in middleware support
 * - Easy to integrate with databases and template engines
 */

// Basic Express.js setup example:
const express = require('express');
const app = express();

// Example 1: Simple server setup
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


// ============================================================================
// TOPIC 2: ROUTING
// ============================================================================

/*
 * What is Routing?
 * - Routing determines how an application responds to client requests
 * - Each route can have one or more handler functions
 * - Routes are defined using HTTP methods (GET, POST, PUT, DELETE, etc.)
 * 
 * Basic syntax: app.METHOD(PATH, HANDLER)
 * - METHOD: HTTP method (get, post, put, delete, etc.)
 * - PATH: URL path on the server
 * - HANDLER: Function executed when route is matched
 */

// Example 2: Basic GET routes
app.get('/', function(req, res) {
    res.send('Welcome to Home Page!');
});

app.get('/profile', function(req, res) {
    res.send('This is the Profile Page');
});

app.get('/about', function(req, res) {
    res.send('About page - Learn more about us');
});

// Example 3: Route with parameters
app.get('/user/:id', function(req, res) {
    const userId = req.params.id;
    res.send(`User ID is: ${userId}`);
});

// Example 4: Route with multiple parameters
app.get('/products/:category/:id', function(req, res) {
    const { category, id } = req.params;
    res.send(`Category: ${category}, Product ID: ${id}`);
});

// Example 5: Route with query parameters
app.get('/search', function(req, res) {
    const searchTerm = req.query.q;
    res.send(`Searching for: ${searchTerm}`);
    // Access with: /search?q=nodejs
});


// ============================================================================
// TOPIC 3: MIDDLEWARE
// ============================================================================

/*
 * What is Middleware?
 * - Functions that execute between receiving a request and sending a response
 * - Has access to request (req), response (res), and next middleware function
 * - Can perform operations on request/response objects
 * - Can end request-response cycle or pass control to next middleware
 * 
 * Hindi: Jab bhi server request accept karta hai waha se route ke beech 
 * pahuchne tak agar aap us request ko beech me rokte ho and kuchh perform 
 * karte ho, to ye element middleware kehlaata hai
 * 
 * Middleware functions can:
 * - Execute any code
 * - Modify request and response objects
 * - End the request-response cycle
 * - Call the next middleware in the stack
 */

// Example 6: Simple middleware - logs every request
app.use(function(req, res, next) {
    console.log('Middleware executed at:', new Date().toISOString());
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    next(); // Pass control to next middleware/route
});

// Example 7: Multiple middleware functions
app.use(function(req, res, next) {
    console.log('First middleware chala');
    next();
});

app.use(function(req, res, next) {
    console.log('Second middleware chala again');
    next();
});

// Example 8: Authentication middleware (example)
function authMiddleware(req, res, next) {
    const isLoggedIn = true; // This would check actual auth status
    
    if (isLoggedIn) {
        console.log('User is authenticated');
        next(); // Proceed to route
    } else {
        res.status(401).send('Unauthorized - Please login first');
    }
}

// Use authentication middleware for specific route
app.get('/dashboard', authMiddleware, function(req, res) {
    res.send('Welcome to your Dashboard');
});

// Example 9: Logging middleware
function loggerMiddleware(req, res, next) {
    const start = Date.now();
    
    // Log when response is finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
}

app.use(loggerMiddleware);


// ============================================================================
// TOPIC 4: REQUEST AND RESPONSE HANDLING
// ============================================================================

/*
 * Request Object (req):
 * - Contains information about the HTTP request
 * - Common properties: params, query, body, headers, method, url
 * 
 * Response Object (res):
 * - Used to send response back to client
 * - Common methods: send(), json(), status(), redirect(), render()
 */

// Example 10: Accessing request properties
app.get('/api/user/:id', function(req, res) {
    // Get URL parameters
    const userId = req.params.id;
    
    // Get query parameters
    const format = req.query.format || 'json';
    
    // Get headers
    const userAgent = req.headers['user-agent'];
    
    res.send({
        userId: userId,
        format: format,
        userAgent: userAgent
    });
});

// Example 11: Different response methods
app.get('/response-examples', function(req, res) {
    // res.send('Simple text response');
    // res.json({ message: 'JSON response', status: 'success' });
    // res.status(404).send('Not found');
    // res.redirect('/');
    res.sendStatus(200); // Send status code only
});

// Example 12: Sending JSON data
app.get('/api/data', function(req, res) {
    const data = {
        users: [
            { id: 1, name: 'John', age: 25 },
            { id: 2, name: 'Jane', age: 30 }
        ],
        total: 2
    };
    
    res.json(data);
});

// Example 13: Setting response headers
app.get('/custom-headers', function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.set('X-Custom-Header', 'MyValue');
    res.send('Response with custom headers');
});

// Example 14: POST request handling (requires body-parser)
app.use(express.json()); // Built-in middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.post('/api/submit', function(req, res) {
    const userData = req.body;
    console.log('Received data:', userData);
    
    res.status(201).json({
        message: 'Data received successfully',
        data: userData
    });
});


// ============================================================================
// TOPIC 5: ERROR HANDLING
// ============================================================================

/*
 * Error Handling in Express:
 * - Error-handling middleware has 4 parameters: (err, req, res, next)
 * - Must be defined AFTER all other routes and middleware
 * - Can catch and handle errors from anywhere in the application
 * - Use next(error) to pass errors to error handler
 */

// Example 15: Route with error
app.get('/error-example', function(req, res, next) {
    // Simulate an error
    return next(new Error('Something went wrong in this route!'));
});

app.get('/profile-error', function(req, res, next) {
    try {
        // Some operation that might fail
        throw new Error('Database connection failed');
    } catch (error) {
        next(error); // Pass error to error handler
    }
});

// Example 16: Custom error handler middleware
app.use(function(err, req, res, next) {
    console.error('Error occurred:');
    console.error(err.stack);
    
    res.status(500).json({
        error: 'Something broke!',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Example 17: Multiple error handlers for different error types
function notFoundHandler(req, res, next) {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot find ${req.url}`
    });
}

function validationErrorHandler(err, req, res, next) {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    }
    next(err); // Pass to next error handler
}

function generalErrorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on the server'
    });
}


// ============================================================================
// TOPIC 6: STATIC FILES SERVING
// ============================================================================

/*
 * Serving Static Files:
 * - Express can serve static files like HTML, CSS, JS, images
 * - Use express.static() built-in middleware
 * - Files are served from a specified directory
 * - Common use: serving frontend files, images, CSS, JavaScript
 */

// Example 18: Serve static files from 'public' directory
// app.use(express.static('public'));
// Now files in 'public' folder are accessible:
// http://localhost:3000/image.jpg
// http://localhost:3000/css/style.css
// http://localhost:3000/js/script.js

// Example 19: Serve static files with virtual path prefix
// app.use('/static', express.static('public'));
// Now accessible at:
// http://localhost:3000/static/image.jpg

// Example 20: Serve multiple static directories
// app.use(express.static('public'));
// app.use(express.static('files'));
// app.use(express.static('uploads'));

// Example 21: Serve static files with absolute path
const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

// Example 22: Set cache control for static files
// app.use(express.static('public', {
//     maxAge: '1d', // Cache for 1 day
//     etag: true
// }));


// ============================================================================
// PRACTICAL EXAMPLES COMBINING MULTIPLE CONCEPTS
// ============================================================================

// Example 23: Complete CRUD API structure
const users = []; // In-memory storage (use database in production)

// GET all users
app.get('/api/users', function(req, res) {
    res.json({ users: users, count: users.length });
});

// GET single user
app.get('/api/users/:id', function(req, res) {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
});

// CREATE new user
app.post('/api/users', function(req, res) {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        createdAt: new Date()
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
});

// UPDATE user
app.put('/api/users/:id', function(req, res) {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.updatedAt = new Date();
    
    res.json(user);
});

// DELETE user
app.delete('/api/users/:id', function(req, res) {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(index, 1);
    res.status(204).send(); // No content
});


// ============================================================================
// BEST PRACTICES AND TIPS
// ============================================================================

/*
 * 1. Always use middleware to parse request bodies:
 *    - app.use(express.json())
 *    - app.use(express.urlencoded({ extended: true }))
 * 
 * 2. Order matters:
 *    - Define middleware before routes
 *    - Define error handlers after all routes
 * 
 * 3. Always call next() in middleware (unless ending the response)
 * 
 * 4. Use proper HTTP status codes:
 *    - 200: Success
 *    - 201: Created
 *    - 400: Bad Request
 *    - 401: Unauthorized
 *    - 404: Not Found
 *    - 500: Internal Server Error
 * 
 * 5. Handle errors properly:
 *    - Use try-catch blocks
 *    - Pass errors to next()
 *    - Create custom error handler middleware
 * 
 * 6. Use environment variables for configuration:
 *    - Port numbers
 *    - Database URLs
 *    - API keys
 * 
 * 7. Organize routes in separate files for larger applications
 * 
 * 8. Use async/await for asynchronous operations
 */

// Example 24: Using environment variables
const PORT = process.env.PORT || 3000;

// Example 25: Async route handler
app.get('/api/async-example', async function(req, res, next) {
    try {
        // Simulate async operation
        const data = await Promise.resolve({ message: 'Async operation completed' });
        res.json(data);
    } catch (error) {
        next(error); // Pass error to error handler
    }
});


// ============================================================================
// START THE SERVER
// ============================================================================

// Uncomment to start server:
/*
app.listen(PORT, function() {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
*/


// ============================================================================
// SUMMARY
// ============================================================================

/*
 * Day 2 covered:
 * 1. Introduction to Express.js - Framework basics
 * 2. Routing - Defining endpoints for different HTTP methods
 * 3. Middleware - Functions that execute between request and response
 * 4. Request & Response - Handling incoming data and sending responses
 * 5. Error Handling - Managing errors gracefully
 * 6. Static Files - Serving HTML, CSS, JS, and other static content
 * 
 * Next steps:
 * - Learn about template engines (EJS, Pug)
 * - Database integration (MongoDB, MySQL)
 * - Authentication and authorization
 * - RESTful API design
 * - Express Router for better organization
 */
