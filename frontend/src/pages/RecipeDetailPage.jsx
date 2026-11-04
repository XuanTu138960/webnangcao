import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  HeartFill,
  Bookmark,
  BookmarkFill,
  Clock,
  People,
  Fire,
  CheckCircle,
  Share,
} from 'react-bootstrap-icons';
import { recipeApi, userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ServingsCalculator from '../components/recipes/ServingsCalculator';
import NutritionCard from '../components/recipes/NutritionCard';
import CommentSection from '../components/comments/CommentSection';
import RecipeCard from '../components/recipes/RecipeCard';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentServings, setCurrentServings] = useState(4);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const res = await recipeApi.getById(id);
      setRecipe(res);
      setCurrentServings(res.servings || 4);

      // Fetch related recipes
      if (res.category) {
        const relatedRes = await recipeApi.getAll({ category: res.category, limit: 4 });
        setRelatedRecipes((relatedRes.data || []).filter((r) => r.id !== id).slice(0, 3));
      }
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin công thức');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
    window.scrollTo(0, 0);
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) return alert('Vui lòng đăng nhập!');
    try {
      const res = await recipeApi.toggleLike(recipe.id);
      setRecipe({ ...recipe, isLiked: res.liked, likesCount: res.likesCount });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return alert('Vui lòng đăng nhập!');
    try {
      const res = await recipeApi.toggleSave(recipe.id);
      setRecipe({ ...recipe, isSaved: res.saved });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStepCompleted = (index) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Đang tải công thức...</p>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Không tìm thấy công thức'}</Alert>
        <Link to="/" className="btn btn-primary btn-cookio-primary">Quay lại trang chủ</Link>
      </Container>
    );
  }

  // Parse ingredients
  const ingredientLines = (recipe.ingredients || '').split('\n').filter((l) => l.trim());
  const scaleRatio = currentServings / (recipe.servings || 4);

  // Parse instructions
  const instructionLines = (recipe.instructions || '').split('\n').filter((l) => l.trim());

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <div className="small text-muted mb-3">
        <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
        {' / '}
        <Link to={`/?category=${recipe.category}`} className="text-decoration-none text-muted">
          {recipe.category}
        </Link>
        {' / '}
        <span className="text-dark fw-semibold">{recipe.title}</span>
      </div>

      <Row className="gy-4">
        {/* Left Column: Image & Details */}
        <Col lg={8}>
          <div className="position-relative rounded-4 overflow-hidden mb-4 shadow-sm" style={{ maxHeight: '420px' }}>
            <img
              src={recipe.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000'}
              alt={recipe.title}
              className="w-100 h-100 object-fit-cover"
              style={{ maxHeight: '420px', minHeight: '300px' }}
            />
            <Badge
              bg="dark"
              className="position-absolute top-0 start-0 m-3 px-3 py-2 bg-opacity-75 text-warning fs-6"
            >
              {recipe.category}
            </Badge>
          </div>

          <h1 className="fw-bold mb-3">{recipe.title}</h1>

          <p className="text-muted fs-6 mb-4 leading-relaxed">
            {recipe.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="d-flex flex-wrap gap-4 py-3 px-4 bg-light rounded-4 mb-4 border align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <Clock className="text-warning fs-4" />
              <div>
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Thời gian nấu</small>
                <strong>{recipe.cookTime || 20} phút</strong>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <People className="text-primary fs-4" />
              <div>
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Khẩu phần gốc</small>
                <strong>{recipe.servings || 4} người</strong>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Fire className="text-danger fs-4" />
              <div>
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Độ khó</small>
                <strong>{recipe.difficulty || 'Trung bình'}</strong>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-2">
              <Button
                variant={recipe.isLiked ? 'danger' : 'outline-danger'}
                className="d-flex align-items-center gap-1 rounded-pill px-3"
                onClick={handleLike}
              >
                {recipe.isLiked ? <HeartFill /> : <Heart />}
                <span>{recipe.likesCount || 0}</span>
              </Button>

              <Button
                variant={recipe.isSaved ? 'warning' : 'outline-secondary'}
                className="d-flex align-items-center gap-1 rounded-pill px-3"
                onClick={handleSave}
              >
                {recipe.isSaved ? <BookmarkFill /> : <Bookmark />}
                <span>{recipe.isSaved ? 'Đã lưu' : 'Lưu'}</span>
              </Button>
            </div>
          </div>

          {/* Ingredients Section with Servings Calculator */}
          <div className="mb-4">
            <h4 className="fw-bold mb-3">🛒 Nguyên Liệu Cần Chuẩn Bị</h4>
            <ServingsCalculator
              baseServings={recipe.servings || 4}
              currentServings={currentServings}
              onServingsChange={setCurrentServings}
            />

            <ul className="list-group list-group-flush border rounded-3 overflow-hidden">
              {ingredientLines.map((line, idx) => (
                <li key={idx} className="list-group-item d-flex align-items-center gap-3 py-2">
                  <span className="text-warning fs-5">✓</span>
                  <span className="fw-medium">{line}</span>
                  {scaleRatio !== 1 && (
                    <small className="text-muted ms-auto">
                      (Điều chỉnh theo {currentServings} người)
                    </small>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Cooking Instructions with interactive checkboxes */}
          <div className="mb-4">
            <h4 className="fw-bold mb-3">👨‍🍳 Các Bước Thực Hiện</h4>
            <div className="d-flex flex-column gap-3">
              {instructionLines.map((step, idx) => {
                const isDone = completedSteps[idx];
                return (
                  <Card
                    key={idx}
                    className={`border transition-all ${
                      isDone ? 'bg-light opacity-75 border-success' : 'bg-white'
                    } p-3 rounded-3 shadow-none`}
                    onClick={() => toggleStepCompleted(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex gap-3 align-items-start">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                          isDone
                            ? 'bg-success text-white'
                            : 'bg-warning text-dark'
                        }`}
                        style={{ width: '36px', height: '36px', flexShrink: 0 }}
                      >
                        {isDone ? <CheckCircle size={18} /> : idx + 1}
                      </div>
                      <div className="flex-grow-1">
                        <div className={`fs-6 ${isDone ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                          {step}
                        </div>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Bấm để đánh dấu hoàn thành bước này
                        </small>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Kitchen Tips */}
          {recipe.dietaryTags && (
            <Card className="border-0 bg-warning bg-opacity-10 p-3 rounded-3 mb-4">
              <h6 className="fw-bold text-dark mb-1">💡 Mẹo & Lưu ý từ đầu bếp</h6>
              <p className="small mb-0 text-dark">
                {recipe.dietaryTags}
              </p>
            </Card>
          )}

          {/* Comments Section */}
          <CommentSection recipeId={recipe.id} />
        </Col>

        {/* Right Sidebar: Nutrition, Author, Related Recipes */}
        <Col lg={4}>
          {/* Author Card */}
          <Card className="border-0 shadow-sm p-3 rounded-4 mb-4 bg-light">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img
                src={recipe.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={recipe.author?.fullName}
                className="rounded-circle border"
                style={{ width: '56px', height: '56px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold mb-0">
                  <Link
                    to={`/profile/${recipe.author?.username}`}
                    className="text-dark text-decoration-none"
                  >
                    {recipe.author?.fullName || 'Đầu bếp Cookio'}
                  </Link>
                </h6>
                <small className="text-muted">@{recipe.author?.username}</small>
              </div>
            </div>
            {recipe.author?.bio && (
              <p className="small text-muted mb-3">{recipe.author.bio}</p>
            )}
            <Button
              as={Link}
              to={`/profile/${recipe.author?.username}`}
              variant="outline-primary"
              size="sm"
              className="w-100 rounded-pill fw-semibold"
            >
              Xem trang đầu bếp
            </Button>
          </Card>

          {/* Nutrition Card */}
          <NutritionCard
            calories={recipe.calories}
            protein={28}
            carbs={35}
            fat={14}
            servings={currentServings}
          />

          {/* Related Recipes */}
          {relatedRecipes.length > 0 && (
            <div className="mt-4">
              <h5 className="fw-bold mb-3">🍲 Món Cùng Danh Mục</h5>
              <div className="d-flex flex-column gap-3">
                {relatedRecipes.map((rel) => (
                  <Card key={rel.id} className="border-0 shadow-sm overflow-hidden rounded-3">
                    <Row className="g-0 align-items-center">
                      <Col xs={4}>
                        <img
                          src={rel.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}
                          alt={rel.title}
                          className="w-100 h-100 object-fit-cover"
                          style={{ height: '80px' }}
                        />
                      </Col>
                      <Col xs={8}>
                        <Card.Body className="p-2">
                          <Link
                            to={`/recipes/${rel.id}`}
                            className="text-dark text-decoration-none fw-semibold small text-truncate-2 d-block"
                          >
                            {rel.title}
                          </Link>
                          <small className="text-muted d-block mt-1">
                            ⏱️ {rel.cookTime || 20}p • ❤️ {rel.likesCount || 0}
                          </small>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
