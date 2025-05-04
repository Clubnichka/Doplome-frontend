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
  const { id } = useParams(); // Получаем id книги из URL
  const [book, setBook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const token = getCookie("token"); // Получаем токен из cookies

    // Если токен отсутствует, выходим (или показываем ошибку)
    if (!token) {
      console.error("No token found");
      return;
    }

    // Загружаем книгу
    axios.get(`http://localhost:8080/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, // Добавляем токен в заголовок
    })
      .then(response => setBook(response.data))
      .catch(error => console.error("There was an error fetching the book!", error));

    // Запрос для получения PDF-файла
    axios.get(`http://localhost:8080/books/${id}/read`, {
      headers: { Authorization: `Bearer ${token}` }, // Добавляем токен в заголовок
      responseType: 'blob',
    })
      .then(response => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        setPdfUrl(URL.createObjectURL(file));
      })
      .catch(error => console.error("Error fetching PDF file:", error));
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <p>{book.publisher}</p>
      <p>{book.genre}</p>
      <p>{book.releaseDate}</p>

      {/* Отображаем PDF через object */}
      {pdfUrl && (
        <object data={pdfUrl} type="application/pdf" width="100%" height="600px">
          <p>PDF не поддерживается в вашем браузере.</p>
        </object>
      )}
    </div>
  );
};

export default BookDetail;