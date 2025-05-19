import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Функция для получения токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const BookDetail = () => {
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

    // Загружаем информацию о книге
    axios.get(`http://localhost:8080/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setBook(response.data))
      .catch(error => console.error("Ошибка при получении данных о книге", error));

    // Загружаем PDF и подготавливаем URL
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
      const response = await axios.post(
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
    <div>
      <h1>{book.title}</h1>
      <p>Автор: {book.author}</p>
      <p>Издатель: {book.publisher}</p>
      <p>Жанр: {book.genre}</p>
      <p>Дата выхода: {book.releaseDate}</p>
      <p>Местоположение: {book.location}</p>
      <p>Доступно экземпляров: {book.availableCopies}</p>

      <button onClick={handleBooking}>Забронировать</button>

      {pdfUrl && (
        <button onClick={() => window.open(pdfUrl, "_blank")}>
          Читать
        </button>
      )}

      {bookingMessage && <p>{bookingMessage}</p>}
    </div>
  );
};

export default BookDetail;