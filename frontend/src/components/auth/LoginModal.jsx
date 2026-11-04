import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ show, onHide, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onHide();
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <span className="text-primary me-2">🍳</span> Đăng nhập Cookio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        <p className="text-muted small mb-4">
          Cùng khám phá và chia sẻ hàng ngàn công thức nấu ăn ngon mỗi ngày!
        </p>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email hoặc Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="admin@cookio.vn hoặc tên đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu (demo: password123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2 fw-semibold btn-cookio-primary"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
          </Button>
        </Form>

        <div className="text-center mt-3 small text-muted">
          Chưa có tài khoản Cookio?{' '}
          <Button
            variant="link"
            className="p-0 text-decoration-none fw-semibold"
            onClick={onSwitchToRegister}
          >
            Đăng ký tài khoản
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
