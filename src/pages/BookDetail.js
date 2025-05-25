import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./BookDetail.css"; // Стили отдельно

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const BookDetail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios.get(`http://localhost:8080/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setBook(response.data))
      .catch(error => console.error("Ошибка при получении данных о книге", error));

    axios.get(`http://localhost:8080/books/${id}/read`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
      .then(response => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        setPdfUrl(URL.createObjectURL(file));
      })
      .catch(error => console.error("Ошибка при загрузке PDF", error));
  }, [id]);

  const handleBooking = async () => {
    const token = getCookie("token");
    if (!token) {
      setBookingMessage("Авторизуйтесь для бронирования книги.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/bookings",
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setBookingMessage("Книга успешно забронирована!");
    } catch (error) {
      if (error.response && error.response.data) {
        setBookingMessage(error.response.data);
      } else {
        setBookingMessage("Произошла ошибка при бронировании.");
      }
    }
  };

  if (!book) return <div>Загрузка...</div>;

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="book-detail-container">
        <div className="book-info-card">
          <div className="cover-wrapper">
          {book.coverImage ? (
            <img
              src={`data:image/jpeg;base64,${book.coverImage}`}
              alt="Обложка"
              className="book-detail-cover"
            />
          ) : (
            <div className="book-detail-cover placeholder">Нет обложки</div>
          )}
          </div>

          <div className="book-meta">
            <h2>{book.title}</h2>
            <p><strong>Автор:</strong> {book.author}</p>
            <p><strong>Издатель:</strong> {book.publisher}</p>
            <p><strong>Жанр:</strong> {book.genre}</p>
            <p><strong>Дата выхода:</strong> {book.releaseDate}</p>
            <p><strong>Местоположение:</strong> {book.location}</p>
            <p><strong>Доступно экземпляров:</strong> {book.availableCopies}</p>

            <div className="book-buttons">
              <button className="book-btn" onClick={handleBooking}>Забронировать</button>
              {pdfUrl && (
                <button className="book-btn read-btn" onClick={() => window.open(pdfUrl, "_blank")}>
                  Читать
                </button>
              )}
            </div>

            {bookingMessage && <p className="booking-message">{bookingMessage}</p>}

            {book.tags && book.tags.length > 0 && (
              <div className="tag-section">
                <h5>Теги:</h5>
                <div className="tag-list">
                  {book.tags.map((tag, index) => (
                    <span key={index} className="tag-item">{tag.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookDetail;