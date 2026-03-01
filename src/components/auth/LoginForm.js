import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Función del formulario de sesión
function LoginForm() {
  // Guarda los campos del formulario:
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // Si el login falla, guarda el error:
  const [error, setError] = useState('');

  // login viene del AuthContext: llama al backend y actualiza el estado user
  const { login } = useAuth();
  const navigate = useNavigate();

  // Maneja los cambios de los datos del formulario
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Se envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita recarga de página
    setError('');       // limpia errores previos

    try {
      // Se intenta el login: si ok, AuthContext guarda el user
      await login(formData.email, formData.password);
      // Se redirige al home
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  // Formulario de comprobación de datos de inicio de sesión
  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Iniciar Sesión
      </Button>
    </Form>
  );
}

export default LoginForm;