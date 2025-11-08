const express = require('express');
const cookieParser = require('cookie-parser');
const usermodel = require("./models/user");
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// ---------- ROUTES ----------

// Home page → Show registration form
app.get('/', (req, res) => {
  res.render("index");
});

// Create user (register)
app.post('/create', function (req, res) {
  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createduser = await usermodel.create({
        username,
        email,
        password: hash,
        age
      });

      console.log(createduser);
      let token = jwt.sign({ email }, "jsjsjsjsjjsjsjs");
      res.cookie("token", token);
      

      res.redirect('/login');
      
    });
  });
});

// Show login page (GET)
app.get('/login', function (req, res) {
  res.render('login');
});

// Login user (POST)
app.post('/login', async function (req, res) {
  let user = await usermodel.findOne({ email: req.body.email });
  if (!user) {
    return res.send("User not found!");
  }

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result) {
        
      let token = jwt.sign({ email: user.email }, "jsjsjsjsjjsjsjs");
      res.cookie("token", token);
      res.send("Login successful!");
    } else {
      res.send("you can't  log in!");
    }
  });
});

// Logout route
app.get('/logout', function (req, res) {
  res.cookie("token", "");
  res.redirect('/');
});

app.listen(4000);
