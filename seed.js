const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('books.db');

db.exec('DROP TABLE IF EXISTS books');
db.exec(`
  CREATE TABLE books (
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

const books = [
  ['Solaris', 'Stanislaw Lem', 1961, 'Science fiction', 204, 'Poland', 4.2],
  ['Roadside Picnic', 'Arkady and Boris Strugatsky', 1972, 'Science fiction', 224, 'USSR', 4.3],
  ['Hard to Be a God', 'Arkady and Boris Strugatsky', 1964, 'Science fiction', 240, 'USSR', 4.3],
  ['Dune', 'Frank Herbert', 1965, 'Science fiction', 412, 'USA', 4.5],
  ['Foundation', 'Isaac Asimov', 1951, 'Science fiction', 255, 'USA', 4.2],
  ['Neuromancer', 'William Gibson', 1984, 'Cyberpunk', 271, 'USA', 4.0],
  ['The Master and Margarita', 'Mikhail Bulgakov', 1967, 'Novel', 384, 'USSR', 4.6],
  ['Crime and Punishment', 'Fyodor Dostoevsky', 1866, 'Novel', 671, 'Russia', 4.5],
  ['War and Peace', 'Leo Tolstoy', 1869, 'Historical novel', 1225, 'Russia', 4.4],
  ['1984', 'George Orwell', 1949, 'Dystopian', 328, 'UK', 4.4],
  ['Brave New World', 'Aldous Huxley', 1932, 'Dystopian', 268, 'UK', 4.1],
  ['The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy', 310, 'UK', 4.6],
  ['Pride and Prejudice', 'Jane Austen', 1813, 'Romance', 432, 'UK', 4.3],
  ['One Hundred Years of Solitude', 'Gabriel Garcia Marquez', 1967, 'Magical realism', 417, 'Colombia', 4.4],
  ['The Little Prince', 'Antoine de Saint-Exupery', 1943, 'Fable', 96, 'France', 4.5]
];

const insert = db.prepare(
  'INSERT INTO books (title, author, year, genre, pages, country, rating) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

for (const book of books) {
  insert.run(...book);
}

console.log(`Inserted ${books.length} books`);
