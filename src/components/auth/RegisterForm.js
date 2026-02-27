import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

function RegisterForm() {
  // Estado del formulario: aquí guardamos lo que el usuario escribe en cada campo
  const [formData, setFormData] = useState({
    username: '', // Nombre de usuario
    email: '', // Email
    password: '', // Contraseña
    confirmPassword: '', // Confirmación de contraseña
  });

  // Estado para mensajes de error y éxito (se muestran con Alerts)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Función que se ejecuta cada vez que el usuario escribe en un input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev, // Mantiene el resto de campos como estaban
      [e.target.name]: e.target.value, // Actualiza solo el campo que ha cambiado (según el "name")
    }));
  };

  // Función que se ejecuta al enviar el formulario (submit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(''); // Limpia error anterior
    setSuccess(''); // Limpia éxito anterior

    // Validación: comprobar que las contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return; // Sale para no hacer la petición al backend
    }

    // Validación: longitud del username
    if (formData.username.length < 4 || formData.username.length > 20) {
      setError('El nombre de usuario debe tener entre 4 y 20 caracteres');
      return;
    }

    // Validación: solo letras, números y guion bajo en username
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('El nombre de usuario solo puede contener letras, números y guion bajo');
      return;
    }

    // Validación: contraseña mínimo 8 caracteres
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Validación: contraseña debe tener al menos 1 carácter especial de esta lista
    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError('La contraseña debe incluir al menos un carácter especial (!@#$%^&*)');
      return;
    }

    try {
      // Llama al backend para registrar al usuario
      // Solo enviamos username, email y password (confirmPassword es solo para validar en frontend)
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Si el registro va bien, mostramos mensaje y vaciamos el formulario
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      // Si el backend responde con error, mostramos el mensaje si existe
      setError(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Si hay error, se muestra alerta roja */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Si hay éxito, se muestra alerta verde */}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Campo: Nombre de usuario */}
      <Form.Group className="mb-3">
        <Form.Label>Nombre de Usuario</Form.Label>
        <Form.Control
          type="text" // Input de texto
          name="username" // IMPORTANTE: debe coincidir con la clave en formData
          value={formData.username} // Lo que se ve en el input viene del estado
          onChange={handleChange} // Al escribir, actualiza el estado
          required // HTML: obliga a que no esté vacío
        />
      </Form.Group>

      {/* Campo: Email */}
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email" // Input tipo email (valida formato básico)
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Campo: Contraseña */}
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password" // Oculta los caracteres
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Campo: Confirmar contraseña */}
      <Form.Group className="mb-3">
        <Form.Label>Confirmar Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Botón de enviar */}
      <Button variant="primary" type="submit" className="w-100">
        Registrarse
      </Button>
    </Form>
  );
}

export default RegisterForm;