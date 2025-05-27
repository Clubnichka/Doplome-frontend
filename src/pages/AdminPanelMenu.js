// src/pages/AdminPanelMenu.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AdminPages.css";

const AdminPanelMenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 style={{ visibility: "hidden" }}>a</h1>
      <div className="admin-page-container flex-grow-1">
        <h2>Панель администратора</h2>
        <div className="admin-card text-center">
          <div className="d-grid gap-3">
            <button
              className="btn btn-outline-primary btn-lg"
              onClick={() => handleNavigate("/admin/add-book")}
            >
              ➕ Добавить книгу
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => handleNavigate("/admin/users")}
            >
              👥 Список пользователей
            </button>
            <button
              className="btn btn-outline-success btn-lg"
              onClick={() => handleNavigate("/admin/reservations")}
            >
              📖 Активные брони
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanelMenu;