import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, Link } from "react-router-dom";

// Функция получения токена из куки (копия из BookDetail)
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const FilterResults = () => {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const size = 5;

  useEffect(() => {
    const fetchBooks = async () => {
      const token = getCookie("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const params = new URLSearchParams(location.search);
        params.append("page", page);
        params.append("size", size);

        const res = await axios.get(`http://localhost:8080/books/filter?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data.content);
        setTotal(res.data.totalElements);
      } catch (error) {
        console.error("Ошибка при получении отфильтрованных книг", error);
      }
    };

    fetchBooks();
  }, [location.search, page]);

  return (
    <>
      <Navbar />
      <Container className="mt-5 mb-5">
        <h2>Результаты фильтрации ({total})</h2>

        {books.length === 0 && <p>Книги не найдены.</p>}

        {books.map((book) => (
          <div
            key={book.id}
            className="p-4 mb-3 border rounded w-100"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            <h4>{book.title}</h4>
            <p><strong>Автор:</strong> {book.author}</p>
            <p><strong>Жанр:</strong> {book.genre}</p>
            <p><strong>Год:</strong> {book.publishedDate}</p>
            <p><strong>Местоположение:</strong> {book.location}</p>
            <p><strong>Доступно:</strong> {book.availableCopies} экземпляров</p>
            <Link to={`/books/${book.id}`}>Читать</Link>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            Назад
          </Button>
          <Button onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * size >= total}>
            Вперёд
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default FilterResults;