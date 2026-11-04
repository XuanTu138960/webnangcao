import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function RegisterModal({ show, onHide, onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp');
    }
    if (formData.password.length < 6) {
      return setError('Mật khẩu phải từ 6 ký tự trở lên');
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      onHide();
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <span className="text-primary me-2">🍳</span> Đăng ký tài khoản Cookio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        <p className="text-muted small mb-3">
          Tạo tài khoản để lưu công thức yêu thích và chia sẻ món ngon của bạn!
        </p>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold small">Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Nguyễn Xuân Tú"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold small">Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="xuantu_chef"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold small">Địa chỉ Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="xuantu@cookio.vn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold small">Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Ít nhất 6 ký tự"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2 fw-semibold btn-cookio-primary"
            disabled={loading}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
          </Button>
        </Form>

        <div className="text-center mt-3 small text-muted">
          Đã có tài khoản?{' '}
          <Button
            variant="link"
            className="p-0 text-decoration-none fw-semibold"
            onClick={onSwitchToLogin}
          >
            Đăng nhập
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
