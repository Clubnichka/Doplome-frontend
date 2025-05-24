import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Navbar.css";

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
  } catch {
    return null;
  }
};

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const token = getCookie("token");
  const decoded = token ? parseJwt(token) : null;
  const isAdmin = decoded?.role === "ADMIN";

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>
          <Link to="/" className="logo-link">📚 eLibrary</Link>
        </h2>
      </div>
      <div className="nav-center">
        <input
          type="text"
          placeholder="Поиск книги..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div className="nav-right">
        <Button as={Link} to="/filter" variant="outline-light">
          Фильтр
        </Button>
        {decoded ? (
          <>
            <span>👤 {decoded.sub}</span>
            {isAdmin && (
              <Button variant="outline-warning" as={Link} to="/admin">
                Панель админа
              </Button>
            )}
            <Button variant="outline-danger" onClick={handleLogout}>
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
  );
};

export default Navbar;