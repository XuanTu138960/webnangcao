import React, { useState } from 'react';
import {
  Navbar as BsNavbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Bookmark, Person, BoxArrowRight, ShieldShaded } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <BsNavbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2 cookio-navbar">
        <Container>
          {/* Logo Cookio */}
          <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-decoration-none">
            <span className="fs-3">🍳</span>
            <span className="brand-logo-text" style={{ fontSize: '1.6rem', color: '#FF6B00', fontWeight: '800' }}>
              Cookio
            </span>
          </BsNavbar.Brand>

          <BsNavbar.Toggle aria-controls="cookio-nav" />

          <BsNavbar.Collapse id="cookio-nav">
            {/* Search Bar */}
            <Form onSubmit={handleSearch} className="d-flex mx-auto my-2 my-lg-0 navbar-search-form" style={{ maxWidth: '400px', width: '100%' }}>
              <div className="input-group">
                <FormControl
                  type="search"
                  placeholder="Tìm món ăn, nguyên liệu..."
                  className="border-end-0 bg-light rounded-start-pill ps-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="light" type="submit" className="border-start-0 bg-light rounded-end-pill pe-3 text-secondary">
                  <Search />
                </Button>
              </div>
            </Form>

            {/* Nav Links */}
            <Nav className="ms-auto align-items-center gap-2">
              <Nav.Link as={Link} to="/" className="fw-medium text-dark">
                Trang chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/smart-fridge" className="fw-medium text-dark">
                🧊 Tủ lạnh thông minh
              </Nav.Link>
              <Nav.Link as={Link} to="/kitchen-tips" className="fw-medium text-dark">
                💡 Mẹo nhà bếp
              </Nav.Link>

              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/recipes/create" className="btn btn-outline-warning text-dark fw-semibold d-flex align-items-center gap-1 px-3 py-1 rounded-pill">
                    <PlusCircle className="text-warning" /> Tạo món mới
                  </Nav.Link>

                  <NotificationDropdown />

                  <NavDropdown
                    title={
                      <div className="d-inline-flex align-items-center gap-2">
                        <img
                          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={user?.fullName}
                          className="rounded-circle border"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <span className="fw-medium text-dark small">{user?.fullName?.split(' ')[0] || user?.username}</span>
                      </div>
                    }
                    id="user-nav-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to={`/profile/${user?.username}`}>
                      <Person className="me-2" /> Trang cá nhân
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-recipes">
                      🍳 Món của tôi
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/saved">
                      <Bookmark className="me-2" /> Công thức đã lưu
                    </NavDropdown.Item>

                    {isAdmin && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin" className="text-danger fw-semibold">
                          <ShieldShaded className="me-2" /> Quản trị viên
                        </NavDropdown.Item>
                      </>
                    )}

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout} className="text-danger">
                      <BoxArrowRight className="me-2" /> Đăng xuất
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill px-3 fw-semibold"
                    onClick={() => setShowLogin(true)}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-pill px-3 fw-semibold btn-cookio-primary"
                    onClick={() => setShowRegister(true)}
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>

      <LoginModal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
