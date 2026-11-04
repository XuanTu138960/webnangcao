import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function RecipeSearch({
  searchQuery,
  onSearchChange,
  cookingTime,
  onCookingTimeChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="bg-light p-3 rounded-4 mb-4 border">
      <Row className="g-2 align-items-center">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm theo tên món hoặc nguyên liệu (thịt bò, hành tây...)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-pill"
          />
        </Col>

        <Col sm={6} md={3}>
          <Form.Select
            value={cookingTime}
            onChange={(e) => onCookingTimeChange(e.target.value)}
            className="rounded-pill"
          >
            <option value="">⏱️ Thời gian nấu</option>
            <option value="15">Dưới 15 phút</option>
            <option value="30">Dưới 30 phút</option>
            <option value="60">Dưới 1 tiếng</option>
          </Form.Select>
        </Col>

        <Col sm={6} md={3}>
          <Form.Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-pill"
          >
            <option value="newest">Mới nhất</option>
            <option value="popular">Yêu thích nhất</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="views">Lượt xem nhiều nhất</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}
