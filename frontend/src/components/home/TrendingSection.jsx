import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { Fire } from 'react-bootstrap-icons';
import RecipeCard from '../recipes/RecipeCard';

export default function TrendingSection({ recipes = [], onActionSuccess }) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Fire className="text-danger fs-3" />
          <h4 className="fw-bold mb-0">Món Ăn Thịnh Hành</h4>
          <Badge bg="danger" className="ms-2">HOT</Badge>
        </div>
        <span className="text-muted small">Cập nhật mỗi ngày từ cộng đồng Cookio</span>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {recipes.slice(0, 4).map((recipe) => (
          <Col key={recipe.id}>
            <RecipeCard recipe={recipe} onActionSuccess={onActionSuccess} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
