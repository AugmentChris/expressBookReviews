const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
   // Get username and password from the request body
 const { username, password } = req.body;

 // Check if username and password are provided
 if (!username && !password) {
 return res.status(400).json({ message: "Username and password are required" });
 }
 if (!username) {
 return res.status(400).json({ message: "Username is required" });
 }
 if (!password) {
 return res.status(400).json({ message: "Password is required" });
 }

 // Check if the username already exists
 const userExists = users.some(user => user.username === username);
 if (userExists) {
 return res.status(409).json({ message: "Username '" + username + "' already exists" });
 }

 // If all checks pass, add the new user
 users.push({ username, password });
 return res.status(201).json({ message: "User '" + username + "' registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const bookList = JSON.stringify(books, null, 2);
    return res.status(200).send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Get the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Find the book in booksdb.js
    const book = books[isbn];
    
    // Check if the book exists
    if (book) {
        // Send the book details neatly
        return res.status(200).send(JSON.stringify(book, null, 2));
    } else {
        // If no book is found, send an error
        return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
    }
});

public_users.get('/author/:author', function (req, res) {
    
    const requestedAuthor = req.params.author;
    const bookKeys = Object.keys(books);
    
    // Create an array 
    let matchingBooks = [];
    
    // Loop through all books to find matches
    for (let isbn of bookKeys) {
        if (books[isbn].author.toLowerCase() === requestedAuthor.toLowerCase()) {
            matchingBooks.push(books[isbn]);
        }
    }
    
    // Check if we found any books
    if (matchingBooks.length > 0) {
        // Send the matching books neatly
        return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
    } else {
        // If no books found, send an error
        return res.status(404).json({ message: "No books found by author: " + requestedAuthor });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Get the title from the request parameters
  const requestedTitle = req.params.title;
    
  // Get all book keys (ISBNs) from the books object
  const bookKeys = Object.keys(books);
  
  // Create an array to hold matching books
  let matchingBooks = [];
  
  // Loop through all books to find matches
  for (let isbn of bookKeys) {
      if (books[isbn].title.toLowerCase() === requestedTitle.toLowerCase()) {
          matchingBooks.push(books[isbn]);
      }
  }
  
  // Check if we found any books
  if (matchingBooks.length > 0) {
      // Send the matching books neatly
      return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
      // If no books found, send an error
      return res.status(404).json({ message: "No books found with title: " + requestedTitle });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;
    
  // Check if the book exists
  const book = books[isbn];
  
  if (book) {
      // Check if the book has reviews
      if (book.reviews && Object.keys(book.reviews).length > 0) {
          // Send the reviews neatly
          return res.status(200).send(JSON.stringify(book.reviews, null, 2));
      } else {
          // If no reviews exist
          return res.status(200).json({ message: "No reviews found for ISBN: " + isbn });
      }
  } else {
      // If book not found
      return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }
});

module.exports.general = public_users;
