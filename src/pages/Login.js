import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import api from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/auth/login", formData)
      .then((res) => {
        setToken(res.data.token);
        navigate("/");
      })
      .catch((err) => console.error("Login error:", err));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" }}>
      <Card style={{ width: "100%", maxWidth: "400px", padding: "30px", boxShadow: "0 6px 16px rgba(0,0,0,0.1)", border: "none" }}>
        <h3 className="text-center mb-4">Вход в систему</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите имя"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100" style={{ backgroundColor: "#0d6efd", borderColor: "#0d6efd" }}>
            Войти
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;