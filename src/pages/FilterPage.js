import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import api from "../services/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./FilterPage.css";

const genres = ["Фантастика", "Детектив", "Роман", "История", "Наука", "Поэзия", "Фентези"];

const FilterPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [author, setAuthor] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  useEffect(() => {
    api.get("/tags")
      .then((res) => setAvailableTags(res.data))
      .catch((err) => console.error("Ошибка при загрузке тегов:", err));
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (selectedGenres.length > 0) queryParams.append("genres", selectedGenres.join(","));
    if (selectedTags.length > 0) queryParams.append("tags", selectedTags.join(","));
    if (author) queryParams.append("author", author);
    if (yearFrom) queryParams.append("yearFrom", yearFrom);
    if (yearTo) queryParams.append("yearTo", yearTo);
    window.location.href = `/filter-results?${queryParams.toString()}`;
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1>
        a
      </h1>
      <div className="admin-panel">
        <h2>Фильтрация книг</h2>
        <Form className="book-form">
          <div className="tags-section">
            <p>Жанры:</p>
            <div className="checkbox-list">
              {genres.map((genre) => (
                <label key={genre}>
                  <input
                    type="checkbox"
                    value={genre}
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>

          <div className="tags-section">
            <p>Теги:</p>
            <div className="checkbox-list">
              {availableTags.map((tag) => (
                <label key={tag.id}>
                  <input
                    type="checkbox"
                    value={tag.name}
                    checked={selectedTags.includes(tag.name)}
                    onChange={() => toggleTag(tag.name)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Автор"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="number"
              placeholder="Год от"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
            />
            <input
              type="number"
              placeholder="Год до"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
            />
          </div>

          <button type="button" onClick={handleSearch}>
            Искать
          </button>
        </Form>
      </div>
      <Footer />
    </>
  );
};

export default FilterPage;