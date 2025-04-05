import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });
  const [bookData, setBookData] = useState({ title: "", author: "", inventory: 0, isFree: false });

  const login = async () => {
    const res = await axios.post("http://localhost:5000/auth/login", form);
    setToken(res.data.token);
  };

  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:5000/books");
    setBooks(res.data);
  };

  const addBook = async () => {
    await axios.post("http://localhost:5000/books", bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`http://localhost:5000/books/${id}`);
    fetchBooks();
  };

  useEffect(() => { fetchBooks(); }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={login}>Login</button>

      <h2 className="text-xl font-bold mt-4">Add Book</h2>
      <input placeholder="Title" onChange={e => setBookData({ ...bookData, title: e.target.value })} />
      <input placeholder="Author" onChange={e => setBookData({ ...bookData, author: e.target.value })} />
      <input type="number" placeholder="Inventory" onChange={e => setBookData({ ...bookData, inventory: +e.target.value })} />
      <label>
        <input type="checkbox" onChange={e => setBookData({ ...bookData, isFree: e.target.checked })} /> Free Book
      </label>
      <button onClick={addBook}>Add</button>

      <h2 className="text-xl font-bold mt-4">Books</h2>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            {book.title} by {book.author} ({book.inventory}) {book.isFree && "🆓"}
            <button onClick={() => deleteBook(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
