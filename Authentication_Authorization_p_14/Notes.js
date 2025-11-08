/*
═══════════════════════════════════════════════════════════════════════════
    🔐 BACKEND DAY 7: AUTHENTICATION & AUTHORIZATION - DETAILED NOTES
═══════════════════════════════════════════════════════════════════════════

📚 TABLE OF CONTENTS:
1. Authentication vs Authorization
2. Server Stateless Nature Problem
3. Cookies & Sessions
4. Cookie Implementation
5. Bcrypt - Password Encryption
6. JWT (JSON Web Tokens)
7. Complete Flow Example
8. Best Practices & Security

═══════════════════════════════════════════════════════════════════════════
*/

/*
═══════════════════════════════════════════════════════════════════════════
1️⃣ AUTHENTICATION vs AUTHORIZATION
═══════════════════════════════════════════════════════════════════════════

🔑 AUTHENTICATION (Pramaanikaran)
   ├─ Yeh poochta hai: "Aap kaun ho?" (Who are you?)
   ├─ User ki pehchan verify karna
   ├─ Login process ka hissa
   └─ Example: Username + Password se login karna

👮 AUTHORIZATION (Adhikaar)
   ├─ Yeh poochta hai: "Aapko kya karne ki anumati hai?" (What can you do?)
   ├─ User ke permissions check karna
   ├─ Role-based access control
   └─ Example: Admin hi users ko delete kar sakta hai

📌 REAL-LIFE EXAMPLE:
   Airport Security →
   ├─ Authentication: Passport dikhana (aap kaun ho?)
   └─ Authorization: Boarding Pass dikhana (kis flight mein ja sakte ho?)

*/

/*
═══════════════════════════════════════════════════════════════════════════
2️⃣ SERVER STATELESS NATURE PROBLEM
═══════════════════════════════════════════════════════════════════════════

❓ PROBLEM:
   "Server har baar bhool jaata hai ki aap kaun ho!"
   
   HTTP Protocol STATELESS hai:
   ├─ Har request independent hoti hai
   ├─ Server ko yaad nahi rehta ki aapne pehle login kiya tha
   └─ Har kaam ke liye server poochega: "Aap kaun ho?"

🎭 EXAMPLE SCENARIO:
   Aap login karte ho → Server: "OK, Welcome!"
   Aap profile dekhna chahte ho → Server: "Aap kaun ho? Pehle login karo!"
   Aap post karna chahte ho → Server: "Aap kaun ho? Pehle login karo!"
   
   😫 Har request mein phir se login karna padega!

💡 SOLUTION:
   ├─ Cookies mein token store karo
   ├─ Sessions use karo
   └─ JWT tokens bhejo
   
   Isse server ko yaad rahega ki aap kaun ho!

*/

/*
═══════════════════════════════════════════════════════════════════════════
3️⃣ COOKIES & SESSIONS
═══════════════════════════════════════════════════════════════════════════

🍪 COOKIES:
   ├─ Chhoti file hoti hai
   ├─ Browser mein store hoti hai (CLIENT-SIDE)
   ├─ Har request ke saath automatically server ko bheji jaati hai
   ├─ Expiry date set kar sakte hain
   └─ 4KB tak data store kar sakte hain

📦 SESSIONS:
   ├─ Server-side par store hota hai
   ├─ Database ya memory mein rehta hai
   ├─ Session ID cookie mein bheji jaati hai browser ko
   ├─ Zyada secure hai (data server par hai)
   └─ Server ka memory use karta hai

📊 COMPARISON:
   
   Feature          | Cookies          | Sessions
   ─────────────────┼──────────────────┼─────────────────
   Storage          | Client (Browser) | Server
   Security         | Less Secure      | More Secure
   Data Size        | 4KB max          | Unlimited
   Performance      | Fast             | Slower
   Server Load      | None             | Memory usage
   Expiry           | Can be set       | Usually temp

🔄 HOW THEY WORK TOGETHER:
   1. User login karta hai
   2. Server session banata hai (server par)
   3. Session ID ek cookie mein bheja jaata hai (browser ko)
   4. Browser har request mein cookie bhejta hai
   5. Server cookie se session ID padhkar user identify karta hai

*/

/*
═══════════════════════════════════════════════════════════════════════════
4️⃣ COOKIE IMPLEMENTATION (कुकी कैसे काम करती है)
═══════════════════════════════════════════════════════════════════════════

📦 REQUIRED PACKAGE:
   npm install cookie-parser

*/

// ─────────────────────────────────────────────────────────────────────────
// STEP 1: Setup
// ─────────────────────────────────────────────────────────────────────────
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware: Cookie parser ko use karna zaroori hai
app.use(cookieParser());

// ─────────────────────────────────────────────────────────────────────────
// STEP 2: COOKIE SET karna (Writing Cookie)
// ─────────────────────────────────────────────────────────────────────────
app.get('/set-cookie', (req, res) => {
    // Simple cookie
    res.cookie('username', 'Guddu');
    
    // Cookie with options
    res.cookie('userId', '12345', {
        maxAge: 900000,      // 15 minutes (milliseconds mein)
        httpOnly: true,      // JavaScript se access nahi ho sakta (security)
        secure: false,       // HTTPS ke liye true karein
        sameSite: 'strict'   // CSRF protection
    });
    
    res.send('Cookies set successfully! ✅');
});

// ─────────────────────────────────────────────────────────────────────────
// STEP 3: COOKIE READ karna (Reading Cookie)
// ─────────────────────────────────────────────────────────────────────────
app.get('/read-cookie', (req, res) => {
    // Saari cookies read karna
    console.log('All Cookies:', req.cookies);
    
    // Specific cookie read karna
    const username = req.cookies.username;
    const userId = req.cookies.userId;
    
    res.send(`Username: ${username}, UserID: ${userId}`);

});

// ─────────────────────────────────────────────────────────────────────────
// STEP 4: COOKIE DELETE karna (Clearing Cookie)
// ─────────────────────────────────────────────────────────────────────────
app.get('/clear-cookie', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('userId');
    res.send('Cookies cleared! 🗑️');
});

/*
═══════════════════════════════════════════════════════════════════════════
5️⃣ BCRYPT - PASSWORD ENCRYPTION
═══════════════════════════════════════════════════════════════════════════

🔐 BCRYPT kya hai?
   ├─ Password ko encrypt (hash) karne ka library
   ├─ One-way hashing algorithm (decrypt nahi ho sakta)
   ├─ Salt rounds se security badhata hai
   └─ Same password bhi har baar different hash banata hai

❓ PASSWORD PLAIN TEXT mein kyun nahi store karte?
   ├─ Database hack hone par saare passwords leak ho jayenge
   ├─ Admin bhi user ka password dekh sakta hai (privacy issue)
   └─ Legal aur ethical problem

📦 REQUIRED PACKAGE:
   npm install bcrypt

🔢 SALT ROUNDS:
   ├─ Jitna zyada, utna secure
   ├─ Lekin jitna zyada, utna slow
   └─ Recommended: 10-12 rounds

*/

const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────────────────────
// METHOD 1: PASSWORD HASH karna (Encryption)
// ─────────────────────────────────────────────────────────────────────────

// Auto-generate salt and hash
app.get('/hash-password', async (req, res) => {
    const plainPassword = 'myPassword123';
    const saltRounds = 10;
    
    try {
        // Hash banana
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        console.log('Plain Password:', plainPassword);
        console.log('Hashed Password:', hash);
        // Output: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
        
        res.send(`Hashed: ${hash}`);
    } catch (error) {
        res.status(500).send('Error hashing password');
        
    }
});

// Manual salt generation
app.get('/hash-manual', (req, res) => {
    const plainPassword = 'myPassword123';
    
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(500).send('Error generating salt');
        
        bcrypt.hash(plainPassword, salt, (err, hash) => {
            if (err) return res.status(500).send('Error hashing password');
            
            console.log('Salt:', salt);
            console.log('Hash:', hash);
            res.send(`Hash: ${hash}`);
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────
// METHOD 2: PASSWORD VERIFY karna (Comparison)
// ─────────────────────────────────────────────────────────────────────────

app.get('/verify-password', async (req, res) => {
    const plainPassword = 'pododododo';
    const hashedPassword = '$2b$10$7mlWq9X2RhJja6SCGH3f3OdgXo/c6kiamM10uxBrXJ2H./qCVKLPa';
    
    try {
        // Password match karna
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        
        console.log('Is Password Correct?', isMatch); // true ya false
        
        if (isMatch) {
            res.send('✅ Password is correct! Login successful.');
        } else {
            res.send('❌ Wrong password! Access denied.');
        }
    } catch (error) {
        res.status(500).send('Error verifying password');
    }
});

// Callback style
app.get('/verify-callback', (req, res) => {
    const plainPassword = 'pododododo';
    const hashedPassword = '$2b$10$7mlWq9X2RhJja6SCGH3f3OdgXo/c6kiamM10uxBrXJ2H./qCVKLPa';
    
    bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
        if (err) return res.status(500).send('Error');
        
        console.log('Result:', result); // true/false
        res.send(`Password match: ${result}`);
    });
});

/*
📝 BCRYPT HASH FORMAT EXPLAINED:
   $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
   │  │  │                                                          │
   │  │  │                                                          └─ Hash (31 chars)
   │  │  └─ Salt (22 chars)
   │  └─ Cost factor (rounds = 2^10 = 1024)
   └─ Algorithm identifier (bcrypt)

⚠️ IMPORTANT NOTES:
   ├─ Kabhi bhi hash ko decrypt nahi kar sakte
   ├─ Hamesha bcrypt.compare() use karein verification ke liye
   ├─ Same password har baar different hash dega (salt ki wajah se)
   └─ Database mein hash store karein, plain password kabhi nahi
*/

/*
═══════════════════════════════════════════════════════════════════════════
6️⃣ JWT (JSON WEB TOKENS)
═══════════════════════════════════════════════════════════════════════════

🎫 JWT kya hai?
   ├─ JSON Web Token - ek encoded string
   ├─ User information ko securely transfer karne ke liye
   ├─ Three parts mein divided: Header.Payload.Signature
   └─ Stateless authentication ke liye best

📦 REQUIRED PACKAGE:
   npm install jsonwebtoken

🏗️ JWT STRUCTURE:
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBwcEBnbWFpbC5jb20iLCJpYXQiOjE2MzQ1Njc4OTB9.abc123xyz
   │                                      │                                                  │
   │                                      │                                                  └─ SIGNATURE
   │                                      └─ PAYLOAD (your data)
   └─ HEADER (algorithm & type)

✅ JWT ke fayde:
   ├─ Stateless (server par kuch store nahi karna)
   ├─ Scalable (multiple servers mein kaam karta hai)
   ├─ Cross-domain authentication
   └─ Mobile apps ke liye perfect

❌ JWT ke nuksan:
   ├─ Token size bada ho sakta hai
   ├─ Token revoke karna mushkil
   └─ Sensitive data store nahi karna chahiye

*/

const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────
// JWT TOKEN CREATE karna (Signing)
// ─────────────────────────────────────────────────────────────────────────

app.get('/create-token', (req, res) => {
    // Data jo token mein store karna hai
    const userData = {
        email: 'ppp@gmail.com',
        userId: 12345,
        role: 'admin'
    };
    
    // Secret key (production mein environment variable mein rakhein)
    const secretKey = 'secret';
    
    // Options (optional)
    const options = {
        expiresIn: '1h'  // 1 hour mein expire ho jayega
    };
    
    // Token generate karna
    const token = jwt.sign(userData, secretKey, options);
    
    console.log('Generated Token:', token);
    
    // Token ko cookie mein store karna
    res.cookie('token', token);
    
    res.send('Token created and stored in cookie! ✅');
});

// ─────────────────────────────────────────────────────────────────────────
// JWT TOKEN VERIFY & DECODE karna (Verification)
// ─────────────────────────────────────────────────────────────────────────

app.get('/verify-token', (req, res) => {
    // Cookie se token nikalna
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).send('No token found! Please login first.');
    }
    
    const secretKey = 'secret';
    
    try {
        // Token verify karna aur data nikalna
        const decoded = jwt.verify(token, secretKey);
        
        console.log('Decoded Data:', decoded);
        /*
        Output:
        {
          email: 'ppp@gmail.com',
          userId: 12345,
          role: 'admin',
          iat: 1634567890,  // issued at (timestamp)
          exp: 1634571490   // expiry time (timestamp)
        }
        */
        
        res.send(`Welcome back, ${decoded.email}! Your role is: ${decoded.role}`);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).send('Invalid or expired token! ❌');
    }
});

// ─────────────────────────────────────────────────────────────────────────
// TOKEN DECODE (without verification) - Keval dekhne ke liye
// ─────────────────────────────────────────────────────────────────────────

app.get('/decode-token', (req, res) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).send('No token found!');
    }
    
    // Verify nahi karega, sirf decode karega (unsafe for production)
    const decoded = jwt.decode(token);
    console.log('Decoded (unverified):', decoded);
    
    res.json(decoded);
});

/*
═══════════════════════════════════════════════════════════════════════════
7️⃣ COMPLETE AUTHENTICATION FLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════════

📝 FLOW DIAGRAM:

   User Registration:
   ┌─────────────────────────────────────────────────────────────────┐
   │ 1. User bhejta hai: email + password                            │
   │ 2. Server bcrypt se password hash karta hai                     │
   │ 3. Database mein save: email + hashed_password                  │
   │ 4. Response: "Registration successful!"                         │
   └─────────────────────────────────────────────────────────────────┘

   User Login:
   ┌─────────────────────────────────────────────────────────────────┐
   │ 1. User bhejta hai: email + password                            │
   │ 2. Database se user dhundho (email se)                          │
   │ 3. bcrypt.compare() se password verify karo                     │
   │ 4. Agar match: JWT token banao                                  │
   │ 5. Token ko cookie mein store karo                              │
   │ 6. Response: "Login successful!"                                │
   └─────────────────────────────────────────────────────────────────┘

   Protected Route Access:
   ┌─────────────────────────────────────────────────────────────────┐
   │ 1. User protected route access karta hai                        │
   │ 2. Cookie se token nikalo                                       │
   │ 3. jwt.verify() se token validate karo                          │
   │ 4. Agar valid: User data nikalo aur access do                   │
   │ 5. Agar invalid: "Unauthorized" error bhejo                     │
   └─────────────────────────────────────────────────────────────────┘

*/

// ─────────────────────────────────────────────────────────────────────────
// EXAMPLE: Complete Implementation
// ─────────────────────────────────────────────────────────────────────────

// Fake database (production mein MongoDB/PostgreSQL use karein)
const users = [];

// REGISTRATION
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).send('User already exists!');
    }
    
    // Password hash karna
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // User save karna
    users.push({
        id: users.length + 1,
        email: email,
        password: hashedPassword
    });
    
    res.send('Registration successful! ✅');
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // User dhundhna
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).send('User not found!');
    }
    
    // Password verify karna
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).send('Wrong password!');
    }
    
    // JWT token banana
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        'secret',
        { expiresIn: '24h' }
    );
    
    // Token cookie mein store karna
    res.cookie('token', token, { httpOnly: true });
    
    res.send('Login successful! 🎉');
});

// MIDDLEWARE: Token verify karne ke liye
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).send('Access denied! Please login first. 🔒');
    }
    
    try {
        const verified = jwt.verify(token, 'secret');
        req.user = verified;  // User data ko request mein add kar do
        next();  // Proceed to next middleware/route
    } catch (error) {
        res.status(403).send('Invalid token! ❌');
    }
}

// PROTECTED ROUTE (Keval logged-in users ke liye)
app.get('/profile', authenticateToken, (req, res) => {
    // req.user mein user data hai (middleware se)
    res.send(`Welcome to your profile, ${req.user.email}! 👤`);
});

// ADMIN-ONLY ROUTE (Authorization example)
app.get('/admin', authenticateToken, (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied! Admins only. 👮');
    }
    
    res.send('Welcome to admin panel! 🔐');
});

// LOGOUT
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('Logged out successfully! 👋');
});

/*
═══════════════════════════════════════════════════════════════════════════
8️⃣ BEST PRACTICES & SECURITY TIPS
═══════════════════════════════════════════════════════════════════════════

🔒 PASSWORD SECURITY:
   ✅ Hamesha bcrypt use karein (ya argon2, scrypt)
   ✅ Salt rounds: 10-12 recommended
   ✅ Kabhi plain text password store mat karein
   ✅ Password ko logs mein print mat karein
   ❌ MD5, SHA1 use mat karein (weak hain)

🎫 JWT SECURITY:
   ✅ Strong secret key use karein (random, long string)
   ✅ Secret ko environment variables mein rakhein
   ✅ Expiry time set karein (e.g., 1h, 24h)
   ✅ HTTPS use karein production mein
   ❌ Sensitive data (password, card details) JWT mein store mat karein
   ❌ Secret key ko code mein hardcode mat karein

🍪 COOKIE SECURITY:
   ✅ httpOnly: true (JavaScript se access prevent karta hai - XSS protection)
   ✅ secure: true (Keval HTTPS mein bheje - production ke liye)
   ✅ sameSite: 'strict' or 'lax' (CSRF protection)
   ✅ Expiry time set karein
   ❌ Sensitive data plain cookies mein store mat karein

🛡️ GENERAL SECURITY:
   ✅ HTTPS use karein
   ✅ Rate limiting implement karein (brute force attack se bachne ke liye)
   ✅ Input validation karein
   ✅ SQL injection prevent karein (prepared statements use karein)
   ✅ CORS properly configure karein
   ✅ Dependencies regularly update karein
   ✅ Error messages mein sensitive info leak mat karein

📦 ENVIRONMENT VARIABLES (.env file):
   JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
   COOKIE_SECRET=another_secret_key
   BCRYPT_ROUNDS=10

   Usage:
   require('dotenv').config();
   const secret = process.env.JWT_SECRET;

*/

/*
═══════════════════════════════════════════════════════════════════════════
📚 SUMMARY - KEY TAKEAWAYS
═══════════════════════════════════════════════════════════════════════════

1️⃣ AUTHENTICATION vs AUTHORIZATION:
   ├─ Authentication = Aap kaun ho? (Identity)
   └─ Authorization = Aap kya kar sakte ho? (Permissions)

2️⃣ SERVER STATELESS PROBLEM:
   └─ Server bhool jaata hai → Cookies/JWT se solution

3️⃣ COOKIES:
   ├─ Browser mein store hote hain
   ├─ res.cookie() se set karo
   └─ req.cookies se read karo

4️⃣ BCRYPT:
   ├─ bcrypt.hash() → Password ko hash karna
   ├─ bcrypt.compare() → Password verify karna
   └─ Kabhi decrypt nahi ho sakta

5️⃣ JWT:
   ├─ jwt.sign() → Token banana
   ├─ jwt.verify() → Token verify karna
   └─ Stateless authentication ke liye best

6️⃣ COMPLETE FLOW:
   Registration → Hash password → Save to DB
   Login → Verify password → Generate JWT → Send cookie
   Protected Route → Verify JWT → Allow/Deny access

7️⃣ SECURITY:
   ├─ httpOnly cookies use karein
   ├─ Strong secret keys use karein
   ├─ HTTPS mein deploy karein
   └─ Never store sensitive data in JWT/cookies

═══════════════════════════════════════════════════════════════════════════
🎓 PRACTICE EXERCISES:
═══════════════════════════════════════════════════════════════════════════

1. Ek registration system banao with email validation
2. Login attempt limit karo (max 3 tries)
3. Password reset functionality add karo
4. Remember me checkbox implement karo (longer expiry)
5. Refresh token system implement karo
6. Role-based access control banao (user, admin, moderator)
7. Session management with Redis implement karo

═══════════════════════════════════════════════════════════════════════════
📖 FURTHER READING:
═══════════════════════════════════════════════════════════════════════════

- OAuth 2.0 & OpenID Connect
- Passport.js (authentication middleware)
- Session stores (Redis, MongoDB)
- Two-Factor Authentication (2FA)
- Refresh tokens & access tokens
- Social login (Google, Facebook, GitHub)

═══════════════════════════════════════════════════════════════════════════

🎉 Congratulations on completing Backend Day 7!
   Aapne Authentication & Authorization ki poori samajh bana li hai! 💪

═══════════════════════════════════════════════════════════════════════════
*/

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log('🎓 Backend Day 7 - Authentication & Authorization');
});
