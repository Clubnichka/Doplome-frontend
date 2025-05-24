// src/pages/AdminPanelMenu.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminPanelMenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="container my-5 flex-grow-1">
        <h2 className="text-center mb-4">Админ-панель</h2>
        <div className="row justify-content-center">
          <div className="col-md-6 d-grid gap-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => handleNavigate("/admin/add-book")}
            >
              ➕ Добавить книгу
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => handleNavigate("/admin/users")}
            >
              👥 Список пользователей
            </button>
            <button
              className="btn btn-success btn-lg"
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