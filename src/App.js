import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import BookDetail from "./pages/BookDetail"; // Импортируем компонент для отображения книги
import FilterPage from "./pages/FilterPage";
import FilterResults from "./pages/FilterResults";

const App = () => {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/books/:id" element={<BookDetail />} /> {/* Добавляем маршрут для страницы книги */}
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/filter-results" element={<FilterResults />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;