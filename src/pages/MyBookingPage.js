import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MyBookingsPage.css";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const MyBookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getCookie("token");

  const fetchBookings = () => {
    axios
      .get("http://localhost:8080/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении бронирований:", err);
        setLoading(false);
        if (err.response?.status === 403) alert("У вас нет доступа к этой странице.");
      });
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, []);

  const cancelBooking = (id) => {
    if (!window.confirm("Вы уверены, что хотите отменить бронирование?")) return;

    axios
      .put(
        `http://localhost:8080/api/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Бронирование отменено");
        fetchBookings();
      })
      .catch((err) => {
        console.error("Ошибка при отмене бронирования:", err);
        alert("Не удалось отменить бронирование.");
      });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 style={{ display: "none" }}>a</h1>
      <div className="my-bookings-container flex-grow-1 p-4">
        <h2 className="mb-4 text-center">Мои бронирования</h2>
        {bookings.length === 0 ? (
          <p className="text-center">У вас нет активных бронирований.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{booking.bookTitle}</h5>
                <p>
                  <strong>Дата брони:</strong> {booking.bookingDate}
                </p>
                <p>
                  <strong>Статус:</strong> {booking.status}
                </p>
                {booking.status === "ACTIVE" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Отменить бронь
                  </button>
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

export default MyBookingsPage;