import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar"; // Импорт навигации

const genres = ["Фантастика", "Детектив", "Роман", "История", "Наука", "Поэзия","Фентези"];

const FilterPage = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [author, setAuthor] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

const availableTags = ["научная","психология","классика", "приключения", "мистика", "юмор", "философия","фантастика","художественная","бестселлер"];

const [selectedTags, setSelectedTags] = useState([]);

const toggleTag = (tag) => {
  setSelectedTags((prev) =>
    prev.includes(tag)
      ? prev.filter((t) => t !== tag)
      : [...prev, tag]
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
      <Navbar /> {/* Навигационная панель */}
      <Container className="mt-5 mb-5">
        <h2>Фильтрация каталога</h2>
        <Form>
          <Form.Group>
            <Form.Label>Жанры:</Form.Label>
            <Row>
              {genres.map((genre) => (
                <Col xs={6} md={4} key={genre}>
                  <Form.Check
                    type="checkbox"
                    label={genre}
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>
          <Form.Group className="mt-3">
          <Form.Label>Теги:</Form.Label>
          <Row>
            {availableTags.map((tag) => (
              <Col xs={6} md={4} key={tag}>
                <Form.Check
                  type="checkbox"
                  label={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
              </Col>
            ))}
          </Row>
        </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Автор:</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Введите автора"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Год издания:</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="От"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="До"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Button className="mt-4" variant="primary" onClick={handleSearch}>
            Искать
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default FilterPage;