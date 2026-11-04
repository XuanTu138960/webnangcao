import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';

export const HeroBanner = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div
      className="py-5 position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF6EE 0%, #FFE8D6 100%)',
        borderBottom: '1px solid rgba(255, 107, 0, 0.15)',
      }}
    >
      <Container className="py-2">
        <Row className="align-items-center">
          <Col lg={8} className="text-start">
            <Badge bg="danger" className="px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>
              🍳 Nền tảng ẩm thực thông minh Cookio
            </Badge>
            <h1 className="display-5 fw-extrabold text-dark mb-3" style={{ fontWeight: 800 }}>
              Hôm nay bạn muốn <span className="text-cookio">nấu món gì?</span>
            </h1>
            <p className="lead text-secondary mb-4" style={{ maxWidth: '640px' }}>
              Khám phá hàng ngàn công thức nấu nướng thơm ngon, chuẩn định lượng dinh dưỡng từ cộng đồng đầu bếp Cookio. Hỗ trợ tự động nhân tỷ lệ nguyên liệu và chế độ nấu ăn tập trung.
            </p>

            {/* QUICK CATEGORY PILLS */}
            <div className="d-flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`btn btn-sm px-3 py-2 rounded-pill category-pill d-flex align-items-center gap-2 fw-semibold ${
                      isActive ? 'active' : 'bg-white text-dark shadow-sm'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </Col>

          <Col lg={4} className="d-none d-lg-block text-center">
            <div className="position-relative d-inline-block">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80"
                alt="Delicious meal"
                className="rounded-4 shadow-lg"
                style={{ width: '320px', height: '260px', objectFit: 'cover' }}
              />
              <div
                className="position-absolute bottom-0 start-0 m-3 bg-white p-3 rounded-4 shadow-sm text-start"
                style={{ maxWidth: '240px' }}
              >
                <div className="small fw-bold text-dark">🔥 Xu hướng tuần này</div>
                <div className="small text-muted">Hơn 12,000 lượt người nấu thành công cùng Cookio!</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
