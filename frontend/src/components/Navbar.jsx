import React from 'react';
import { Navbar, Container, Nav, Form, Button, Badge } from 'react-bootstrap';
import { HeartFill, PlusCircleFill, PersonCircle, ShieldCheck } from 'react-bootstrap-icons';

export const CustomNavbar = ({
  searchQuery,
  setSearchQuery,
  bookmarkCount,
  onOpenCreateModal,
  onOpenAdminModal,
  currentUser,
  onLoginClick,
  onLogoutClick,
  onShowFavoritesOnly,
  showFavoritesOnly,
}) => {
  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2 border-bottom">
      <Container>
        {/* LOGO COOKIO */}
        <Navbar.Brand
          href="#home"
          onClick={() => onShowFavoritesOnly(false)}
          className="d-flex align-items-center gap-2 fw-bold fs-3 text-cookio"
        >
          <span
            className="d-inline-flex justify-content-center align-items-center bg-cookio rounded-circle shadow-sm"
            style={{ width: '42px', height: '42px', fontSize: '22px' }}
          >
            🍳
          </span>
          <span style={{ letterSpacing: '-0.5px' }}>
            cook<span className="text-dark">io</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="cookio-navbar-nav" />

        <Navbar.Collapse id="cookio-navbar-nav">
          {/* SEARCH BAR (USABILITY: <4 CLICKS ACCESS) */}
          <Form className="d-flex mx-lg-4 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: '420px' }}>
            <Form.Control
              type="search"
              placeholder="🔍 Tìm công thức, nguyên liệu (bò, cá, bánh mì...)"
              className="rounded-pill bg-light border-0 px-3 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>

          {/* RIGHT ACTIONS */}
          <Nav className="ms-auto align-items-center gap-2">
            {/* FAVORITES BUTTON */}
            <Button
              variant={showFavoritesOnly ? 'danger' : 'light'}
              className="rounded-pill d-flex align-items-center gap-1 border-0 px-3"
              onClick={() => onShowFavoritesOnly(!showFavoritesOnly)}
              title="Xem danh sách công thức đã lưu"
            >
              <HeartFill color={showFavoritesOnly ? '#fff' : '#e63946'} size={16} />
              <span className="small fw-semibold">Yêu thích</span>
              <Badge bg={showFavoritesOnly ? 'light' : 'danger'} text={showFavoritesOnly ? 'dark' : 'white'} pill className="ms-1">
                {bookmarkCount}
              </Badge>
            </Button>

            {/* CREATE RECIPE BUTTON */}
            <Button
              variant="cookio"
              className="btn-cookio d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
              onClick={onOpenCreateModal}
            >
              <PlusCircleFill size={16} />
              <span>Đăng công thức</span>
            </Button>

            {/* MODERATOR / ADMIN BUTTON */}
            <Button
              variant="outline-secondary"
              className="rounded-pill d-flex align-items-center gap-1 px-3 py-2 small"
              onClick={onOpenAdminModal}
              title="Bảng kiểm duyệt công thức (US-11)"
            >
              <ShieldCheck size={16} className="text-primary" />
              <span>Duyệt bài</span>
            </Button>

            {/* USER LOGIN / PROFILE */}
            {currentUser ? (
              <div className="d-flex align-items-center gap-2 ms-lg-2">
                <span className="small fw-bold text-secondary">{currentUser.fullName}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-pill px-2 py-1 small"
                  onClick={onLogoutClick}
                >
                  Thoát
                </Button>
              </div>
            ) : (
              <Button
                variant="outline-dark"
                className="rounded-pill d-flex align-items-center gap-1 px-3 py-2 ms-lg-2 small"
                onClick={onLoginClick}
              >
                <PersonCircle size={16} />
                <span>Đăng nhập</span>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
