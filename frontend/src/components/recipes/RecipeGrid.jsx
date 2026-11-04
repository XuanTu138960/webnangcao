import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import RecipeCard from './RecipeCard';

export default function RecipeGrid({ recipes = [], loading = false, onActionSuccess }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted small">Đang tải món ăn...</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-5 bg-light rounded-3 my-3">
        <div className="fs-1 mb-2">🍲</div>
        <h5 className="fw-bold text-secondary">Không tìm thấy món ăn nào</h5>
        <p className="text-muted small">Hãy thử tìm kiếm với từ khóa khác hoặc lọc theo danh mục khác nhé!</p>
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-3">
      {recipes.map((recipe) => (
        <Col key={recipe.id}>
          <RecipeCard recipe={recipe} onActionSuccess={onActionSuccess} />
        </Col>
      ))}
    </Row>
  );
}
