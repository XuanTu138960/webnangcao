import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto cookio-footer">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fs-3">🍳</span>
              <span className="fw-bold fs-4 text-warning">Cookio</span>
            </div>
            <p className="text-secondary small mb-3">
              Cookio - Nền tảng chia sẻ và học hỏi công thức nấu ăn trực tuyến hàng đầu Việt Nam.
              Mô phỏng và nâng cấp toàn diện các tính năng của YummyDay.
            </p>
            <div className="text-secondary small">
              <strong>Tác giả:</strong> Nguyễn Xuân Tú<br />
              <strong>MSV:</strong> 23010538 - Lớp K17_CNTT_6<br />
              <strong>Trường:</strong> Đại học Phenikaa
            </div>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h6 className="fw-bold text-uppercase mb-3 text-warning">Danh mục</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/?category=Món xào" className="text-secondary text-decoration-none">Món xào</Link></li>
              <li><Link to="/?category=Món chiên" className="text-secondary text-decoration-none">Món chiên</Link></li>
              <li><Link to="/?category=Món kho" className="text-secondary text-decoration-none">Món kho</Link></li>
              <li><Link to="/?category=Món canh" className="text-secondary text-decoration-none">Món canh</Link></li>
              <li><Link to="/?category=Món hấp" className="text-secondary text-decoration-none">Món hấp</Link></li>
              <li><Link to="/?category=Món chay" className="text-secondary text-decoration-none">Món chay</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={3} sm={6}>
            <h6 className="fw-bold text-uppercase mb-3 text-warning">Tính năng nổi bật</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/smart-fridge" className="text-secondary text-decoration-none">🧊 Tủ lạnh thông minh</Link></li>
              <li><Link to="/kitchen-tips" className="text-secondary text-decoration-none">💡 Mẹo nấu ăn ngon</Link></li>
              <li><Link to="/recipes/create" className="text-secondary text-decoration-none">📝 Đăng tải công thức</Link></li>
              <li><span className="text-secondary">⚖️ Bộ tính khẩu phần ăn</span></li>
              <li><span className="text-secondary">⭐ Đánh giá & Bình luận</span></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="fw-bold text-uppercase mb-3 text-warning">Công nghệ & Bản quyền</h6>
            <p className="text-secondary small mb-2">
              Xây dựng trên nền tảng <strong>NestJS</strong> (Backend) + <strong>React</strong> & <strong>React-Bootstrap</strong> (Frontend) + <strong>Docker</strong>.
            </p>
            <div className="badge bg-secondary p-2 mb-2">MIT License</div>
            <div className="text-secondary small">
              © {new Date().getFullYear()} Cookio. Đồ án Phát triển ứng dụng Web nâng cao - ĐH Phenikaa.
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="text-center text-secondary small">
          Thiết kế & phát triển với ❤️ bởi Nguyễn Xuân Tú (23010538) - Đại học Phenikaa
        </div>
      </Container>
    </footer>
  );
}
