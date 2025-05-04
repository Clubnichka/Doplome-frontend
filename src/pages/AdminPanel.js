import React, { useState } from "react";
import api from "../services/api";

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
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publisher: "",
    releaseDate: "",
    genre: "",
    pdf: null,  // Добавляем состояние для файла
  });

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
      pdf: e.target.files[0],  // Сохраняем выбранный файл PDF
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = getTokenFromCookies(); // Получаем токен из cookie

    if (!token) {
      alert("You must be logged in as admin to add a book");
      return;
    }

    // Создаем FormData для отправки данных книги и файла
    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("publisher", newBook.publisher);
    formData.append("releaseDate", newBook.releaseDate);
    formData.append("genre", newBook.genre);
    formData.append("file", newBook.pdf);  // Добавляем файл в форму

    api
      .post("/books", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",  // Указываем, что отправляем форму с файлом
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
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newBook.author}
          onChange={handleChange}
        />
        <input
          type="text"
          name="publisher"
          placeholder="Publisher"
          value={newBook.publisher}
          onChange={handleChange}
        />
        <input
          type="text"
          name="releaseDate"
          placeholder="Release Date"
          value={newBook.releaseDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={newBook.genre}
          onChange={handleChange}
        />
        <input
          type="file"
          name="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AdminPanel;