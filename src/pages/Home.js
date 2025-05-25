import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home2.css";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

const Home = () => {
  const [recommendations, setRecommendations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        api
          .get("/recommendations", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setRecommendations(response.data))
          .catch((error) =>
            console.error("Error fetching recommendations:", error)
          );
      }
    }
  }, []);

  const filterBooks = (books) =>
    books
      .filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);

  const formatExamples = (examples) => {
    if (!examples || examples.length === 0) return "";
    return ` (${examples.slice(0, 3).join(", ")})`;
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2 >
          Найдено книг: 
        </h2>
      <Container className="mt-5 mb-5" style={{ fontFamily: "Segoe UI, sans-serif" }}>
        {Object.entries(recommendations).map(([category, data]) => {
          const books = data.books || [];
          const examples =
            category === "По жанрам"
              ? data.genres
              : category === "По авторам"
              ? data.authors
              : data.tags;

          return (
            <div key={category} className="genre-section mb-5">
              <h3 className="text-center mb-4">
                Рекомендации {category.toLowerCase()}
                {formatExamples(examples)}
              </h3>
              <div className="book-grid">
                {filterBooks(books).map((book) => (
                  <Link
                    to={`/books/${book.id}`}
                    key={book.id}
                    className="book-card"
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
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </Container>
      <Footer />
    </>
  );
};

export default Home;