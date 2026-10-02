const express = require('express');
const { DatabaseSync } = require('node:sqlite');

const router = express.Router();
const db = new DatabaseSync('books.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    pages INTEGER,
    country TEXT,
    rating REAL
  )
`);

// GET /books or /books?author=lem
router.get('/', (req, res, next) => {
  try {
    let books;
    if (req.query.author) {
      books = db.prepare('SELECT * FROM books WHERE author LIKE ?').all(`%${req.query.author}%`);
    } else {
      books = db.prepare('SELECT * FROM books').all();
    }
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// POST /books
router.post('/', (req, res, next) => {
  try {
    const { title, author, year, genre, pages, country, rating } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'title and author are required' });
    }
    if (year && (!Number.isInteger(year) || year < 0)) {
      return res.status(400).json({ error: 'year must be a positive integer' });
    }
    const result = db
      .prepare('INSERT INTO books (title, author, year, genre, pages, country, rating) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(title, author, year ?? null, genre ?? null, pages ?? null, country ?? null, rating ?? null);
    res.status(201).json({ id: Number(result.lastInsertRowid), title, author, year, genre, pages, country, rating });
  } catch (err) {
    next(err);
  }
});

// DELETE /books/:id
router.delete('/:id', (req, res, next) => {
  try {
    const result = db.prepare('DELETE FROM books WHERE id = ?').run(Number(req.params.id));
    if (result.changes === 0) return res.status(404).json({ error: 'Book not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
