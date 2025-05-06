import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import api from "../services/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/auth/register", formData)
      .then((res) => {
        setToken(res.data.token);
        navigate("/login");
      })
      .catch((err) => console.error("Registration error:", err));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" }}>
      <Card style={{ width: "100%", maxWidth: "400px", padding: "30px", boxShadow: "0 6px 16px rgba(0,0,0,0.1)", border: "none" }}>
        <h3 className="text-center mb-4">Регистрация</h3>
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
          <Form.Group controlId="formPassword" className="mb-3">
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
          <Form.Group controlId="formRole" className="mb-4">
            <Form.Label>Роль</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">Пользователь</option>
              <option value="ADMIN">Администратор</option>
            </Form.Select>
          </Form.Group>
          <Button type="submit" className="w-100" style={{ backgroundColor: "#0d6efd", borderColor: "#0d6efd" }}>
            Зарегистрироваться
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;