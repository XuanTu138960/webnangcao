import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-5">
      <Container>
        <Row className="g-4">
          <Col lg={4}>
            <div className="d-flex align-items-center gap-2 fw-bold fs-3 text-cookio mb-3">
              <span
                className="d-inline-flex justify-content-center align-items-center bg-cookio rounded-circle"
                style={{ width: '38px', height: '38px', fontSize: '20px' }}
              >
                🍳
              </span>
              <span>
                cook<span className="text-dark">io</span>
              </span>
            </div>
            <p className="text-secondary small" style={{ lineHeight: '1.6' }}>
              Cookio là nền tảng ẩm thực thông minh mô phỏng theo YummyDay, đồng hành cùng bạn vào bếp mỗi ngày với hàng ngàn món ăn ngon, chuẩn định lượng và tốt cho sức khỏe gia đình.
            </p>
          </Col>

          <Col sm={6} lg={4}>
            <h6 className="fw-bold text-dark mb-3">Thông tin đồ án học phần</h6>
            <ul className="list-unstyled text-secondary small mb-0">
              <li className="mb-2"><strong>Đơn vị:</strong> Trường Đại học Phenikaa</li>
              <li className="mb-2"><strong>Khoa:</strong> Công nghệ Thông tin</li>
              <li className="mb-2"><strong>Sinh viên thực hiện:</strong> Nguyễn Xuân Tú</li>
              <li className="mb-2"><strong>Mã số sinh viên:</strong> 23010538 - Lớp K17_CNTT_6</li>
              <li className="mb-2"><strong>Mã nguồn:</strong> GitHub webnangcao</li>
            </ul>
          </Col>

          <Col sm={6} lg={4}>
            <h6 className="fw-bold text-dark mb-3">Pháp lý & Giấy phép</h6>
            <p className="text-secondary small mb-2">
              Dự án phát hành dưới giấy phép mã nguồn mở <strong>MIT License</strong>.
            </p>
            <p className="text-secondary small mb-0">
              Tuân thủ Luật An ninh mạng 2018 và Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân.
            </p>
          </Col>
        </Row>

        <div className="text-center text-muted small pt-4 mt-4 border-top">
          © 2026 Cookio Platform | Đồ án Phát triển Ứng dụng Web Nâng Cao - Đại học Phenikaa.
        </div>
      </Container>
    </footer>
  );
};
