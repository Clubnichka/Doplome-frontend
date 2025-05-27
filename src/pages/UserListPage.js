import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AdminPages.css";

// Функция для получения токена из cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const UserListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      setError("Требуется авторизация.");
      return;
    }

    axios
      .get("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Ошибка при получении пользователей:", err);
        setError("Не удалось загрузить пользователей.");
      });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1>
        a
      </h1>
      <div className="admin-page-container flex-grow-1">
        <h2 className="mb-4 text-center">Пользователи</h2>
        <div className="mb-4">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Поиск по имени пользователя..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        {filteredUsers.length === 0 && !error ? (
          <p className="text-center">Пользователи не найдены.</p>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="admin-card">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                  <strong>Роль:</strong> {user.roles}
                </p>
                <h6 className="mt-3">Брони:</h6>
                {user.reservations && user.reservations.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {user.reservations.map((res) => (
                      <li key={res.id} className="list-group-item">
                        {res.bookTitle} — {res.bookingDate} ({res.status})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Нет активных броней</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserListPage;