import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AdminPanelMenu from "./pages/AdminPanelMenu";
import AddBookPage from "./pages/AddBookPage";
import UserListPage from "./pages/UserListPage";
import ActiveReservationsPage from "./pages/ActiveReservationsPage";
import BookDetail from "./pages/BookDetail"; // Импортируем компонент для отображения книги
import FilterPage from "./pages/FilterPage";
import FilterResults from "./pages/FilterResults";
import SearchResults from "./pages/SearchResults";
import EditBookPage from "./pages/EditBookPage";
import MyBookingsPage from "./pages/MyBookingPage";

const App = () => {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanelMenu/>} />
          <Route path="/admin/add-book" element={<AddBookPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/reservations" element={<ActiveReservationsPage />} />
          <Route path="/books/:id" element={<BookDetail />} /> {/* Добавляем маршрут для страницы книги */}
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/filter-results" element={<FilterResults />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/books/:id/edit" element={<EditBookPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage/>}/>
        </Routes>
      </Container>
    </Router>
  );
};

export default App;