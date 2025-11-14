const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const jwt = require("jsonwebtoken");
const axios = require("axios");

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(201).json({ message: "User successfully registered. You can login now" });
    } else {
      return res.status(404).json({ message: "User already exist" });
    }
  }
  return res.status(404).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const filteredBookByAuthor = Object.values(books).filter((book) => book.author.toLowerCase().includes(author));

  if (filteredBookByAuthor.length > 0) {
    res.status(200).json(filteredBookByAuthor);
  } else {
    res.status(404).json({ message: "book with that author is not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const filteredBookByTitle = Object.values(books).filter((book) => book.title.toLowerCase().includes(title));

  if (filteredBookByTitle.length > 0) {
    res.status(200).json(filteredBookByTitle);
  } else {
    res.status(404).json({ message: "book with that title is not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "book not found" });
  }
});

const getAllBooks = async () => {
  try {
    const response = await axios.get("http://localhost:5000/");
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
getAllBooks();


const getBooksByIsbn = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
getBooksByIsbn(2);


const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
getBooksByAuthor("Dante Alighieri");


const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
getBooksByTitle("The Book Of Job");

module.exports.general = public_users;
