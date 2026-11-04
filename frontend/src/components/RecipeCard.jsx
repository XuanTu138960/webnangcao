import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Clock, People, HeartFill, Heart, CheckCircleFill } from 'react-bootstrap-icons';

export const RecipeCard = ({ recipe, isBookmarked, onToggleBookmark, onSelectRecipe }) => {
  return (
    <Card className="h-100 shadow-sm border-0 recipe-card rounded-4 overflow-hidden">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={recipe.thumbnail || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'}
          style={{ height: '210px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => onSelectRecipe(recipe)}
          alt={recipe.title}
        />
        <Badge
          bg="warning"
          text="dark"
          className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill fw-bold shadow-sm"
        >
          {recipe.category?.name || 'Món ngon'}
        </Badge>
        <Button
          variant="light"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(recipe.id);
          }}
          className="position-absolute top-0 end-0 m-3 rounded-circle p-2 shadow-sm border-0"
          title={isBookmarked ? 'Bỏ lưu yêu thích' : 'Lưu món ăn'}
        >
          {isBookmarked ? <HeartFill color="#e63946" size={18} /> : <Heart color="#6c757d" size={18} />}
        </Button>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex align-items-center gap-1 mb-2">
          <Badge bg="success-subtle" text="success" className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill small">
            <CheckCircleFill size={11} /> <span>Đã kiểm duyệt</span>
          </Badge>
          <span className="text-muted small ms-auto">Độ khó: <strong>{recipe.difficultyLevel || 'Dễ'}</strong></span>
        </div>

        <Card.Title
          className="fw-bold fs-6 mb-2 text-dark"
          style={{ cursor: 'pointer', minHeight: '44px', lineHeight: '1.4' }}
          onClick={() => onSelectRecipe(recipe)}
        >
          {recipe.title}
        </Card.Title>

        <Card.Text className="text-secondary small mb-3 text-truncate-2" style={{ minHeight: '38px' }}>
          {recipe.description}
        </Card.Text>

        <Row className="text-secondary small mt-auto py-2 border-top border-light">
          <Col xs={6} className="d-flex align-items-center gap-1">
            <Clock size={14} className="text-cookio" /> <span>{recipe.cookTimeMinutes} phút</span>
          </Col>
          <Col xs={6} className="d-flex align-items-center gap-1 justify-content-end">
            <People size={14} className="text-cookio" /> <span>{recipe.servingSize} người</span>
          </Col>
        </Row>

        <Button
          variant="cookio"
          className="btn-cookio w-100 mt-2 py-2 small"
          onClick={() => onSelectRecipe(recipe)}
        >
          Xem công thức & Nấu
        </Button>
      </Card.Body>
    </Card>
  );
};
