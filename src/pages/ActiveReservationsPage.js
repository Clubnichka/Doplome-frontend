import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Получение токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const ActiveReservationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    axios
      .get("http://localhost:8080/api/bookings/admin/reservations/active", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setReservations(res.data))
      .catch((err) => {
        console.error("Ошибка при получении активных броней:", err);
        if (err.response?.status === 403) {
          alert("У вас нет доступа к этой странице.");
        }
      });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="container my-5 flex-grow-1">
        <h2 className="mb-4 text-center">Активные брони</h2>
        {reservations.length === 0 ? (
          <p className="text-center">Нет активных броней.</p>
        ) : (
          reservations.map((res) => (
            <div key={res.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{res.bookTitle}</h5>
                <p className="card-text"><strong>Пользователь:</strong> {res.userName}</p>
                <p className="card-text"><strong>Истекает:</strong> {res.expiryDate}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ActiveReservationsPage;