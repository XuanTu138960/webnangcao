import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export default function NutritionCard({ calories = 350, protein, carbs, fat, servings = 1 }) {
  return (
    <Card className="border-0 shadow-sm mb-4 bg-light rounded-3 overflow-hidden">
      <Card.Header className="bg-white border-bottom py-2">
        <h6 className="fw-bold mb-0 text-success">🥗 Giá trị dinh dưỡng ước tính</h6>
        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
          (Tính trên mỗi 1 khẩu phần ăn)
        </small>
      </Card.Header>
      <Card.Body className="p-3">
        <Row className="text-center g-2">
          <Col xs={3}>
            <div className="p-2 bg-white rounded-3 shadow-none border">
              <div className="fw-bold text-danger fs-5">{calories || 320}</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Kcal</small>
            </div>
          </Col>
          <Col xs={3}>
            <div className="p-2 bg-white rounded-3 shadow-none border">
              <div className="fw-bold text-primary fs-5">{protein || 28}g</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Protein</small>
            </div>
          </Col>
          <Col xs={3}>
            <div className="p-2 bg-white rounded-3 shadow-none border">
              <div className="fw-bold text-warning fs-5">{carbs || 35}g</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Carbs</small>
            </div>
          </Col>
          <Col xs={3}>
            <div className="p-2 bg-white rounded-3 shadow-none border">
              <div className="fw-bold text-info fs-5">{fat || 12}g</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Chất béo</small>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
