import React, { useState } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Heart, HeartFill, Bookmark, BookmarkFill, Clock, StarFill, Eye } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { recipeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RecipeCard({ recipe, onActionSuccess }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(recipe.isLiked || false);
  const [likesCount, setLikesCount] = useState(recipe.likesCount || 0);
  const [saved, setSaved] = useState(recipe.isSaved || false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thích món ăn này!');
      return;
    }
    try {
      setActionLoading(true);
      const res = await recipeApi.toggleLike(recipe.id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để lưu công thức!');
      return;
    }
    try {
      setActionLoading(true);
      const res = await recipeApi.toggleSave(recipe.id);
      setSaved(res.saved);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0 recipe-card transition-hover overflow-hidden">
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <Link to={`/recipes/${recipe.id}`}>
          <Card.Img
            variant="top"
            src={recipe.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
            alt={recipe.title}
            className="w-100 h-100 object-fit-cover recipe-img-zoom"
          />
        </Link>
        {/* Category Pill */}
        <Badge
          bg="dark"
          className="position-absolute top-0 start-0 m-2 px-2 py-1 bg-opacity-75 text-warning fw-normal"
        >
          {recipe.category || 'Món ngon'}
        </Badge>

        {/* Action buttons (Like & Save) */}
        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-1">
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={handleLike}
            disabled={actionLoading}
            title={liked ? 'Bỏ thích' : 'Thích'}
          >
            {liked ? <HeartFill className="text-danger" size={16} /> : <Heart size={16} />}
          </Button>
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={handleSave}
            disabled={actionLoading}
            title={saved ? 'Bỏ lưu' : 'Lưu vào sổ tay'}
          >
            {saved ? <BookmarkFill className="text-warning" size={16} /> : <Bookmark size={16} />}
          </Button>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Rating and Cooking Time */}
        <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
          <div className="d-flex align-items-center gap-1 text-warning fw-semibold">
            <StarFill size={13} />
            <span>{recipe.averageRating ? recipe.averageRating.toFixed(1) : '5.0'}</span>
            <span className="text-muted fw-normal">({recipe.ratingCount || 1})</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Clock size={13} />
            <span>{recipe.cookTime || 20} phút</span>
          </div>
        </div>

        {/* Title */}
        <Card.Title className="fs-6 fw-bold mb-2 text-truncate-2">
          <Link
            to={`/recipes/${recipe.id}`}
            className="text-dark text-decoration-none hover-primary"
          >
            {recipe.title}
          </Link>
        </Card.Title>

        {/* Description */}
        <p className="card-text text-muted small text-truncate-2 flex-grow-1 mb-3">
          {recipe.description}
        </p>

        {/* Author & Stats Footer */}
        <div className="d-flex justify-content-between align-items-center pt-2 border-top small text-muted">
          <div className="d-flex align-items-center gap-2">
            <img
              src={recipe.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={recipe.author?.fullName}
              className="rounded-circle"
              style={{ width: '22px', height: '22px', objectFit: 'cover' }}
            />
            <span className="text-truncate" style={{ maxWidth: '100px' }}>
              {recipe.author?.fullName?.split(' ')[0] || 'Đầu bếp'}
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-1">
              <HeartFill size={11} className="text-danger opacity-75" /> {likesCount}
            </span>
            <span className="d-flex align-items-center gap-1">
              <Eye size={12} className="opacity-75" /> {recipe.viewsCount || 0}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
