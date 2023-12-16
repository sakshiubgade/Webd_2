// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    // Fetch books
    axios.get('/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));

    // Fetch authors
    axios.get('/authors')
      .then(response => setAuthors(response.data))
      .catch(error => console.error('Error fetching authors:', error));
  }, []);

  return (
    <div>
      <h1>Goodreads Project</h1>

      <div>
        <h2>Books</h2>
        <ul>
          {books.map(book => (
            <li key={book.book_id}>{book.title}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Authors</h2>
        <ul>
          {authors.map(author => (
            <li key={author.author_id}>{author.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
