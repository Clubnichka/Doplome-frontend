import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import api from "../services/api";
import "./Home.css"; // файл со стилями, создадим его отдельно

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

const Home = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));

    const token = getCookie("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser(decoded);
        if (decoded.role === "ADMIN") setIsAdmin(true);
      }
    } else {
      setTokenMissing(true);
    }
  }, []);

  // Группировка книг по жанрам
  const groupedBooks = books.reduce((acc, book) => {
    const genre = book.genre || "Unknown";
    acc[genre] = acc[genre] || [];
    acc[genre].push(book);
    return acc;
  }, {});

  const filteredBooks = Object.fromEntries(
    Object.entries(groupedBooks).map(([genre, books]) => [
      genre,
      books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ])
  );

  return (
    <div className="home-container">
      {/* Навигационная панель */}
      <nav className="navbar">
        <div className="nav-left">
          <h2>📚 eLibrary</h2>
        </div>
        <div className="nav-center">
          <input
            type="text"
            placeholder="Поиск книги..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="nav-right">
        <Button as={Link} to="/filter" variant="outline-light">Фильтр</Button>
        {user ? (
  <>
    <span>👤 {user.sub}</span>
    {isAdmin && (
      <Button variant="outline-warning" as={Link} to="/admin">
        Панель админа
      </Button>
    )}
    <Button variant="outline-danger" onClick={() => {
      document.cookie = "token=; Max-Age=0; path=/"; // удаление токена
      window.location.reload(); // перезагрузка страницы
    }}>
      Выйти
    </Button>
  </>
) : (
  <>
    <Button variant="outline-light" as={Link} to="/login">
      Вход
    </Button>
    <Button variant="outline-light" as={Link} to="/signup">
      Регистрация
    </Button>
  </>
)}
        </div>
      </nav>

      {/* Книги */}
      <div className="genres-container">
        {Object.entries(filteredBooks).map(([genre, books]) => (
          <div key={genre} className="genre-section">
            <h3>{genre}</h3>
            <div className="book-row">
              {books.map((book) => (
                <div key={book.id} className="book-card">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <Link to={`/books/${book.id}`}>Читать</Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Футер */}
      <footer className="footer">
        <p>Проект электронная библиотека, автор — Лебедев А.Д.</p>
      </footer>
    </div>
  );
};

export default Home;