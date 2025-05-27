import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getTokenFromCookies();

  const [bookData, setBookData] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [availableGenres, setAvailableGenres] = useState([]);
  const [newGenreInput, setNewGenreInput] = useState("");

  const [book, setBook] = useState({
    title: "",
    author: "",
    publisher: "",
    releaseDate: "",
    genre: "",
    availableCopies: 0,
    location: "",
    pdf: null,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      alert("Требуется авторизация");
      navigate("/login");
      return;
    }

    api.get(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data = res.data;
        setBookData(data);
        setBook({
          title: data.title,
          author: data.author,
          publisher: data.publisher || "",
          releaseDate: data.releaseDate || "",
          genre: data.genre?.name || "",
          availableCopies: data.availableCopies || 0,
          location: data.location || "",
          pdf: null,
        });
        setSelectedTags(data.tags?.map((tag) => tag.name) || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки книги", err);
        alert("Ошибка загрузки книги");
        navigate("/");
      });
  }, [id, navigate, token]);

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

    if (name === "genre" && value.trim() !== "") {
      setNewGenreInput("");
    }

    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewGenreChange = (e) => {
    const value = e.target.value;
    setNewGenreInput(value);
    if (value.trim() !== "") {
      setBook((prev) => ({
        ...prev,
        genre: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    setBook((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book.title.trim() || !book.author.trim()) {
      setMessage("Поля Название и Автор обязательны");
      return;
    }

    const genreToSend = newGenreInput.trim() || book.genre;
    if (!genreToSend) {
      setMessage("Поле Жанр обязательно");
      return;
    }

    const formData = new FormData();
    Object.entries(book).forEach(([key, value]) => {
      if (key === "pdf" && value) {
        formData.append("file", value);
      } else if (key !== "genre") {
        formData.append(key, value);
      }
    });

    formData.append("genre", genreToSend);
    selectedTags.forEach((tag) => formData.append("tags", tag));
    if (newTagInput.trim()) {
      formData.append("newTags", newTagInput.trim());
    }

    try {
      await api.put(`/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Книга успешно обновлена!");
      setTimeout(() => navigate(`/books/${id}`), 1500);
    } catch (error) {
      console.error("Ошибка при обновлении книги", error);
      setMessage("Ошибка при обновлении книги, попробуйте позже");
    }
  };

  if (!bookData) return <div>Загрузка данных...</div>;

  return (
    <>
      <Navbar />
      <h1 style={{ visibility: "hidden" }}>a</h1>
      <div className="admin-panel">
        <h2>Редактирование книги</h2>
        <form className="book-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Название *"
            value={book.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Автор *"
            value={book.author}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="publisher"
            placeholder="Издатель"
            value={book.publisher}
            onChange={handleChange}
          />
          <input
            type="text"
            name="releaseDate"
            placeholder="Дата выхода"
            value={book.releaseDate}
            onChange={handleChange}
          />

          <select name="genre" value={book.genre} onChange={handleChange}>
            <option value="">Выберите жанр</option>
            {availableGenres.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Или введите новый жанр"
            value={newGenreInput}
            onChange={handleNewGenreChange}
          />

          <input
            type="number"
            name="availableCopies"
            placeholder="Доступно экземпляров"
            min="0"
            value={book.availableCopies}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Местоположение"
            value={book.location}
            onChange={handleChange}
          />

          <div className="tag-section">
            <label>Существующие теги:</label>
            <div className="tag-list">
              {availableTags.map((tag) => (
                <label key={tag.name} className="tag-checkbox">
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
          </div>

          <input
            type="text"
            placeholder="Новые теги (через запятую)"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
          />

          <label>
            Заменить PDF-файл:
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </label>

          <button type="submit" className="submit-btn">
            Сохранить изменения
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditBookPage;