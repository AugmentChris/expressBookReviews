const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username '" + username + "' already exists" });
    }

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
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 2));
    } else {
        return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    const bookKeys = Object.keys(books);
    let matchingBooks = [];

    for (let isbn of bookKeys) {
        if (books[isbn].author.toLowerCase() === requestedAuthor.toLowerCase()) {
            matchingBooks.push(books[isbn]);
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
    } else {
        return res.status(404).json({ message: "No books found by author: " + requestedAuthor });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title;
    const bookKeys = Object.keys(books);
    let matchingBooks = [];

    for (let isbn of bookKeys) {
        if (books[isbn].title.toLowerCase() === requestedTitle.toLowerCase()) {
            matchingBooks.push(books[isbn]);
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
    } else {
        return res.status(404).json({ message: "No books found with title: " + requestedTitle });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        if (book.reviews && Object.keys(book.reviews).length > 0) {
            return res.status(200).send(JSON.stringify(book.reviews, null, 2));
        } else {
            return res.status(200).json({ message: "No reviews found for ISBN: " + isbn });
        }
    } else {
        return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
    }
});

// --- Async / Promise-based helpers (Tasks using Axios) ---

const getAllBooksAsync = async () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });
};

const getBookByISBNAsync = async (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found for ISBN: " + isbn);
        }
    });
};

const getBooksByAuthorAsync = async (author) => {
    return new Promise((resolve, reject) => {
        const matching = Object.values(books).filter(
            (b) => b.author.toLowerCase() === author.toLowerCase()
        );
        if (matching.length > 0) {
            resolve(matching);
        } else {
            reject("No books found by author: " + author);
        }
    });
};

const getBooksByTitleAsync = async (title) => {
    return new Promise((resolve, reject) => {
        const matching = Object.values(books).filter(
            (b) => b.title.toLowerCase() === title.toLowerCase()
        );
        if (matching.length > 0) {
            resolve(matching);
        } else {
            reject("No books found with title: " + title);
        }
    });
};

// Async routes using Axios against local server (optional demo endpoints)
public_users.get('/async/books', async function (req, res) {
    try {
        const result = await getAllBooksAsync();
        return res.status(200).send(JSON.stringify(result, null, 2));
    } catch (err) {
        return res.status(500).json({ message: String(err) });
    }
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const result = await getBookByISBNAsync(req.params.isbn);
        return res.status(200).send(JSON.stringify(result, null, 2));
    } catch (err) {
        return res.status(404).json({ message: String(err) });
    }
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        const result = await getBooksByAuthorAsync(req.params.author);
        return res.status(200).send(JSON.stringify(result, null, 2));
    } catch (err) {
        return res.status(404).json({ message: String(err) });
    }
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        const result = await getBooksByTitleAsync(req.params.title);
        return res.status(200).send(JSON.stringify(result, null, 2));
    } catch (err) {
        return res.status(404).json({ message: String(err) });
    }
});

module.exports.general = public_users;
