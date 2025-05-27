import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AdminPages.css";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const statuses = ["ACTIVE", "COMPLETED", "RETURNED", "CANCELED"];

const ActiveReservationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  const token = getCookie("token");

  const fetchReservations = () => {
    axios
      .get("http://localhost:8080/api/bookings/admin/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReservations(res.data))
      .catch((err) => {
        console.error("Ошибка при получении броней:", err);
        if (err.response?.status === 403) alert("У вас нет доступа к этой странице.");
      });
  };

  useEffect(() => {
    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }
    fetchReservations();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
  };

  const updateStatus = (id) => {
    const newStatus = statusUpdates[id];
    if (!newStatus) return;

    axios
      .put(
        `http://localhost:8080/api/bookings/admin/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Статус обновлён");
        setStatusUpdates((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        fetchReservations();
      })
      .catch((err) => {
        console.error("Ошибка при обновлении статуса:", err);
        alert("Не удалось обновить статус.");
      });
  };

  // Группируем брони по статусу
  const groupedReservations = {};
  statuses.forEach((status) => {
    groupedReservations[status] = reservations.filter((r) => r.status === status);
  });

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1>a</h1>
      <div className="admin-page-container flex-grow-1">
        <h2 className="mb-4 text-center">Все брони</h2>

        {statuses.map((status) => (
          <div key={status} className="mb-5">
            <h3 className="text-center text-capitalize">{status.toLowerCase()}</h3>
            {groupedReservations[status].length === 0 ? (
              <p className="text-center admin-muted">Нет броней с этим статусом.</p>
            ) : (
              groupedReservations[status].map((res) => (
                <div key={res.id} className="admin-card">
                  <div className="card-body">
                    <h5 className="card-title">{res.bookTitle}</h5>
                    <p>
                      <strong>Пользователь:</strong> {res.userName}
                    </p>
                    <p>
                      <strong>Истекает:</strong> {res.expiryDate}
                    </p>
                    <p>
                      <strong>Статус:</strong> {res.status}
                    </p>

                    <div className="d-flex align-items-center mt-3 gap-2">
                      <select
                        className="form-select"
                        value={statusUpdates[res.id] || ""}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      >
                        <option value="">Выберите статус</option>
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s === "ACTIVE" ? "Активна" :
                             s === "COMPLETED" ? "Выдана" :
                             s === "RETURNED" ? "Возвращена" :
                             s === "CANCELED" ? "Отменена" : s}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => updateStatus(res.id)}
                        disabled={!statusUpdates[res.id]}
                      >
                        Изменить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default ActiveReservationsPage;