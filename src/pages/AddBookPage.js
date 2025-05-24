import React, { useState, useEffect } from "react";
import api from "../services/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar"; // Импорт навигации

// Функция для извлечения токена из куки
const getTokenFromCookies = () => {
  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }
  return null;
};

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publisher: "",
    releaseDate: "",
    genre: "",
    pdf: null,
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    api.get("/tags") // предположим, что такой endpoint существует
      .then((response) => setAvailableTags(response.data))
      .catch((error) => console.error("Ошибка при получении тегов:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setNewBook({
      ...newBook,
      pdf: e.target.files[0],
    });
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTags((prev) =>
      e.target.checked ? [...prev, tag] : prev.filter((t) => t !== tag)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = getTokenFromCookies();
    if (!token) {
      alert("You must be logged in as admin to add a book");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("publisher", newBook.publisher);
    formData.append("releaseDate", newBook.releaseDate);
    formData.append("genre", newBook.genre);
    formData.append("file", newBook.pdf);

    selectedTags.forEach((tag) => {
      formData.append("tags", tag); // multiple tags with same key
    });

    api
      .post("/books", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => alert("Book added successfully!"))
      .catch((error) => {
        console.error("There was an error adding the book!", error);
        alert("Failed to add book. Check console for details.");
      });
  };

  return (
    
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={newBook.title} onChange={handleChange} />
        <input type="text" name="author" placeholder="Author" value={newBook.author} onChange={handleChange} />
        <input type="text" name="publisher" placeholder="Publisher" value={newBook.publisher} onChange={handleChange} />
        <input type="text" name="releaseDate" placeholder="Release Date" value={newBook.releaseDate} onChange={handleChange} />
        <input type="text" name="genre" placeholder="Genre" value={newBook.genre} onChange={handleChange} />
        <input type="file" name="file" accept="application/pdf" onChange={handleFileChange} />

        <div>
  <p>Tags:</p>
  {availableTags.map((tag) => (
    <label key={tag}>
      <input
        type="checkbox"
        value={tag}
        checked={selectedTags.includes(tag)}
        onChange={handleTagChange}
      />
      {tag}
    </label>
  ))}
</div>

        <button type="submit">Add Book</button>
      </form>
      <Footer/>
    </div>
  );
};

export default AdminPanel;