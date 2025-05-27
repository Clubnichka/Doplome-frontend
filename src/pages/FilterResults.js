import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import "./FilterResults.css";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const FilterResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const size = 24;

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

  const totalPages = Math.ceil(total / size);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2 className="text-center mb-4" style={{ color: "#333" }}>
        Найдено книг: {total}
      </h2>

      <Container className="mt-5 mb-5" style={{ fontFamily: "Segoe UI, sans-serif" }}>
      <h2 className="text-center mb-4" style={{ color: "#333" }}>
        Найдено книг: {total}
      </h2>
        {books.length === 0 ? (
          <p className="text-center text-muted">Книги не найдены.</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <div className="book-cover">
                  {book.coverBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${book.coverBase64}`}
                      alt="Обложка"
                      className="cover-img"
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="Заглушка"
                      className="cover-img"
                    />
                  )}
                </div>
                <h5 className="text-center mt-2">{book.title}</h5>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-container">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              Назад
            </Button>

            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={index === page ? "primary" : "outline-primary"}
                className={`page-btn ${index === page ? "active-page" : ""}`}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="secondary"
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= totalPages}
            >
              Вперёд
            </Button>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default FilterResults;