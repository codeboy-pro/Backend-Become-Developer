
// ============================================================================
// NODE.JS COMPLETE NOTES WITH EXAMPLES
// ============================================================================

/*
 * WHAT IS NODE.JS?
 * ================
 * Node.js is a JavaScript runtime environment that allows you to run 
 * JavaScript code on the server side. It is built on Chrome's V8 JavaScript 
 * engine and enables developers to build scalable and high-performance 
 * applications using JavaScript.
 * 
 * KEY CONCEPTS:
 * - Programming Language: JavaScript
 * - Technology: Node.js (runtime environment)
 * - Framework: Express.js (popular framework for Node.js)
 * - Library: Various npm packages (fs, http, etc.)
 */

/*
 * NPM (Node Package Manager)
 * ===========================
 * npm init -> Creates package.json
 * package.json -> "lekha jokha" (record/ledger) of the project
 * 
 * It contains:
 * - Project metadata (name, version, description)
 * - Dependencies (packages your project needs)
 * - Scripts (commands to run your project)
 * - Author information
 * 
 * Example:
 * npm init -y  // Creates package.json with default values
 */

// ============================================================================
// FILE SYSTEM (fs) MODULE - File Operations
// ============================================================================

const fs = require('fs');

/*
 * 1. fs.writeFile() - Creates a new file or overwrites existing file
 * ==================================================================
 * Syntax: fs.writeFile(filename, data, callback)
 * - Creates a new file with content
 * - If file exists, it will be overwritten
 * - Asynchronous operation (non-blocking)
 */

// Example:
// fs.writeFile("hey.txt","hey kaise ho",function(err){
//     if(err) console.log(err);
//     else console.log("File created successfully!");
// });


/*
 * 2. fs.appendFile() - Adds content to existing file
 * ===================================================
 * Syntax: fs.appendFile(filename, data, callback)
 * - Adds new content at the end of the file
 * - If file doesn't exist, creates a new file
 * - Useful for logging or adding data without losing existing content
 */

// Example:
// fs.appendFile("hey.txt", " I am fine", (err) => {
//     if(err) {
//         console.error(err);
//     } else {
//         console.log("Content appended successfully!");
//     }
// });


/*
 * 3. fs.rename() - Renames or moves a file
 * =========================================
 * Syntax: fs.rename(oldPath, newPath, callback)
 * - Changes the name of a file
 * - Can also move file to different directory
 * - Old file name is replaced with new name
 */

// Example 1: Simple rename
// fs.rename("hey.txt","hello.txt",function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("File renamed successfully!");
//     }
// });

// Example 2: Another rename operation
// fs.rename("hello.txt","SASA.txt",(err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("File renamed to SASA.txt!");
//     }
// });


/*
 * 4. fs.copyFile() - Copies a file to another location
 * =====================================================
 * Syntax: fs.copyFile(source, destination, callback)
 * - Creates a copy of the file
 * - Original file remains unchanged
 * - Destination directory must exist
 */

// Example:
// fs.copyFile("SASA.txt","./copy/copy.txt",function(err){
//     if(err){
//         console.error(err.message);
//     }
//     else{
//         console.log("File copied successfully!");
//     }
// });


/*
 * 5. fs.unlink() - Deletes a file
 * ================================
 * Syntax: fs.unlink(filename, callback)
 * - Permanently removes/deletes a file
 * - Cannot be undone (no recycle bin)
 * - Use with caution
 */

// Example:
// fs.unlink("SASA.txt",function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("File removed successfully!");
//     }
// });


/*
 * 6. fs.rmdir() / fs.rm() - Removes directories
 * ==============================================
 * fs.rmdir() - Removes empty directory only
 * fs.rm() - Can remove directory with contents (use recursive option)
 * 
 * Syntax: fs.rm(path, {recursive: true}, callback)
 * - recursive: true -> removes directory and all its contents
 * - Be careful: deletes everything inside permanently
 */

// Example:
// fs.rm("./copy",{recursive:true},function(err){
//     if(err){
//         console.error(err);
//     }
//     else{
//         console.log("Directory removed successfully!");
//     }
// });


/*
 * Additional fs methods (examples):
 * ==================================
 */

// fs.readFile() - Read file content
// fs.readFile("example.txt", "utf8", (err, data) => {
//     if(err) console.log(err);
//     else console.log(data);
// });

// fs.mkdir() - Create directory
// fs.mkdir("newFolder", (err) => {
//     if(err) console.log(err);
//     else console.log("Folder created!");
// });

// fs.readdir() - Read directory contents
// fs.readdir("./", (err, files) => {
//     if(err) console.log(err);
//     else console.log(files);
// });


// ============================================================================
// HTTP MODULE - Creating Web Server
// ============================================================================

/*
 * HTTP PROTOCOL
 * =============
 * Internet par kuchh bhi karne ke liye rules banaaye gaye hai unke
 * dwaara jinhone internet banaaya hai. Ab un rules ko follow karna
 * jaruri hai, aur ye rules follow ho isliye ye rules aap ke operating
 * system ke software mein pre installed aate hai.
 * 
 * HTTP (HyperText Transfer Protocol)
 * - Yahi protocol hai ya rule hai jisko follow kare bina aap internet pe
 *   naa hi kuchh bhej sakte ho, naa hi kuchh manga sakte ho
 * - Client-Server communication ke liye use hota hai
 * - Request-Response model par kaam karta hai
 * 
 * How it works:
 * 1. Client (browser) sends HTTP Request to Server
 * 2. Server processes the request
 * 3. Server sends HTTP Response back to Client
 */

const http = require('http');

/*
 * Creating HTTP Server
 * ====================
 * http.createServer() - Creates a server instance
 * - Takes a callback function with (request, response) parameters
 * - req (request): Contains information about the incoming request
 * - res (response): Used to send response back to client
 */

const server = http.createServer(function(req, res){
    // res.end() sends response and ends the connection
    res.end("Hello World");
});

/*
 * server.listen() - Starts the server
 * ====================================
 * Syntax: server.listen(port, [hostname], [callback])
 * - port: Port number where server will listen (e.g., 3000, 8080)
 * - Makes server available at http://localhost:3000
 * - Server keeps running until manually stopped
 */

server.listen(3000);

/*
 * To test the server:
 * 1. Run: node one.js
 * 2. Open browser: http://localhost:3000
 * 3. You should see "Hello World"
 * 4. Stop server: Press Ctrl+C in terminal
 */


// ============================================================================
// ADDITIONAL HTTP SERVER EXAMPLES
// ============================================================================

/*
// Example 1: Server with different routes
const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/') {
        res.end('Home Page');
    } 
    else if(req.url === '/about') {
        res.end('About Page');
    }
    else {
        res.end('404 - Page Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
*/

/*
// Example 2: Server with HTML response
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Welcome to Node.js</h1>');
    res.write('<p>This is an HTML response</p>');
    res.end();
});

server.listen(3000);
*/

/*
// Example 3: Server with JSON response
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    const data = {
        name: 'Node.js',
        version: '20.0.0',
        message: 'Hello from JSON'
    };
    res.end(JSON.stringify(data));
});

server.listen(3000);
*/


// ============================================================================
// SUMMARY
// ============================================================================
/*
 * KEY MODULES COVERED:
 * ====================
 * 1. fs (File System) - For file operations
 *    - writeFile, appendFile, rename, copyFile, unlink, rm
 * 
 * 2. http (HTTP) - For creating web servers
 *    - createServer, listen
 * 
 * IMPORTANT CONCEPTS:
 * ===================
 * - Node.js runs JavaScript on server
 * - Asynchronous programming with callbacks
 * - Error-first callback pattern: (err, data) => {}
 * - HTTP protocol for internet communication
 * - Request-Response cycle
 * 
 * NEXT STEPS:
 * ===========
 * - Learn about Express.js framework
 * - Understand middleware
 * - Work with databases (MongoDB, MySQL)
 * - Learn about REST APIs
 * - Explore async/await and Promises
 */
