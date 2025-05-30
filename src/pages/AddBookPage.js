import React, { useState, useEffect } from "react";
import api from "../services/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./AddBookPage.css";

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
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [availableGenres, setAvailableGenres] = useState([]);
  const [newGenreInput, setNewGenreInput] = useState("");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publisher: "",
    releaseDate: "",
    genre: "",
    availableCopies: "",
    location: "",
    pdf: null,
  });

  useEffect(() => {
    api.get("/tags")
      .then((res) => setAvailableTags(res.data))
      .catch((err) => console.error("Ошибка при получении тегов:", err));
  }, []);

  useEffect(() => {
    api.get("/genres")
      .then((res) => setAvailableGenres(res.data))
      .catch((err) => console.error("Ошибка при получении жанров:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если меняется выбранный жанр — очищаем поле нового жанра
    if (name === "genre" && value.trim() !== "") {
      setNewGenreInput("");
    }

    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработка изменения нового жанра
  const handleNewGenreChange = (e) => {
    const value = e.target.value;
    setNewGenreInput(value);

    // Если введён новый жанр — очищаем выбранный жанр
    if (value.trim() !== "") {
      setNewBook((prev) => ({
        ...prev,
        genre: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    setNewBook((prev) => ({
      ...prev,
      pdf: e.target.files[0],
    }));
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
    // Копируем все поля, кроме genre, чтобы genre добавить отдельно
    Object.entries(newBook).forEach(([key, value]) => {
      if (key === "pdf") {
        formData.append("file", value);
      } else if (key !== "genre") {
        formData.append(key, value);
      }
    });

    // Отправляем только один жанр — новый или выбранный
    const genreToSend = newGenreInput.trim() || newBook.genre;
    formData.append("genre", genreToSend);

    selectedTags.forEach((tag) => formData.append("tags", tag));
    if (newTagInput.trim()) {
      formData.append("newTags", newTagInput.trim());
    }

    api.post("/books", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        alert("Книга успешно добавлена!");
        setNewBook({
          title: "",
          author: "",
          publisher: "",
          releaseDate: "",
          genre: "",
          availableCopies: "",
          location: "",
          pdf: null,
        });
        setSelectedTags([]);
        setNewTagInput("");
        setNewGenreInput("");
      })
      .catch((error) => {
        console.error("Ошибка при добавлении книги:", error);
        alert("Не удалось добавить книгу.");
      });
  };

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 style={{ visibility: "hidden" }}>a</h1>
      <div className="admin-panel">
        <h2>Добавление книги</h2>
        <form className="book-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Название"
            value={newBook.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Автор"
            value={newBook.author}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="publisher"
            placeholder="Издательство"
            value={newBook.publisher}
            onChange={handleChange}
          />
          <input
            type="text"
            name="releaseDate"
            placeholder="Дата публикации (yyyy-mm-dd)"
            value={newBook.releaseDate}
            onChange={handleChange}
          />

          <select name="genre" value={newBook.genre} onChange={handleChange}>
            <option value="">Выберите жанр</option>
            {availableGenres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Новый жанр"
            value={newGenreInput}
            onChange={handleNewGenreChange}
          />

          <input
            type="number"
            name="availableCopies"
            placeholder="Количество экземпляров"
            value={newBook.availableCopies}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Местоположение"
            value={newBook.location}
            onChange={handleChange}
          />
          <input
            type="file"
            name="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />

          <div className="tags-section">
            <p>Выберите теги:</p>
            <div className="checkbox-list">
              {availableTags.map((tag) => (
                <label key={tag.id}>
                  <input
                    type="checkbox"
                    value={tag.name}
                    checked={selectedTags.includes(tag.name)}
                    onChange={handleTagChange}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Новые теги через ;"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
            />
          </div>

          <button type="submit">Добавить книгу</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;