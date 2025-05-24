import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, Link } from "react-router-dom";

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
  const size = 5;

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
      setPage(0); // Сброс страницы при новом запросе
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

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container className="mt-5 mb-5">
        <h2>Результаты поиска ({total})</h2>

        {loading ? (
          <div className="text-center mt-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {books.length === 0 && <p>Книги не найдены.</p>}

            {books.map((book) => (
              <div
                key={book.id}
                className="p-4 mb-3 border rounded w-100 shadow-sm"
                style={{ backgroundColor: "#f9f9f9" }}
              >
                <h4>{book.title}</h4>
                <p><strong>Автор:</strong> {book.author}</p>
                <p><strong>Жанр:</strong> {book.genre}</p>
                <p><strong>Год:</strong> {book.publishedDate}</p>
                <p><strong>Местоположение:</strong> {book.location}</p>
                <p><strong>Доступно:</strong> {book.availableCopies} экземпляров</p>
                <Link to={`/books/${book.id}`} className="btn btn-primary mt-2">Читать</Link>
              </div>
            ))}

            {total > size && (
              <div className="d-flex justify-content-between mt-4">
                <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
                  Назад
                </Button>
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(page + 1) * size >= total}
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