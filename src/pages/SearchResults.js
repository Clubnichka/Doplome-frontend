import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import "./FilterResults.css"; // используем общие стили карточек

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const query = decodeURIComponent(new URLSearchParams(location.search).get("q") || "").trim();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const size = 24;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const token = getCookie("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/books/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: { query, page, size },
        });
        setBooks(res.data.content);
        setTotal(res.data.totalElements);
      } catch (error) {
        console.error("Ошибка при поиске книг:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      setPage(0); // сбрасываем страницу при новом поиске
      fetchBooks();
    }
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const fetchPage = async () => {
      const token = getCookie("token");
      if (!token) return;

      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/books/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: { query, page, size },
        });
        setBooks(res.data.content);
        setTotal(res.data.totalElements);
      } catch (error) {
        console.error("Ошибка при загрузке страницы:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  const totalPages = Math.ceil(total / size);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container className="mt-5 mb-5" style={{ fontFamily: "Segoe UI, sans-serif" }}>
        <h2 className="text-center mb-4" style={{ color: "#333" }}>
          Результаты поиска ({total})
        </h2>

        {loading ? (
          <div className="text-center mt-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : books.length === 0 ? (
          <p className="text-center text-muted">Книги не найдены.</p>
        ) : (
          <>
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
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default SearchResults;