const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return users.some(user => user.username === username);
};


const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate the user
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create a JWT token
    const accessToken = jwt.sign(
        { username: username },
        "fingerprint_customer", // Match the secret from index.js
        { expiresIn: '24h' }
    );

    // Save the token and user info in the session
    req.session.accessToken = accessToken;
    req.session.user = { username: username };

    // Send success response
    return res.status(200).json({ message: "Logged in successfully", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
