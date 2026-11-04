import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';
import { commentApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentItem from './CommentItem';

export default function CommentSection({ recipeId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const res = await commentApi.getByRecipe(recipeId);
      setComments(res || []);
    } catch (err) {
      console.error('Lỗi tải bình luận:', err);
    }
  };

  useEffect(() => {
    if (recipeId) fetchComments();
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    setLoading(true);
    try {
      await commentApi.create({
        recipeId,
        content: content.trim(),
        rating,
      });
      setContent('');
      setRating(5);
      fetchComments();
    } catch (err) {
      setError(err.message || 'Không thể gửi bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId, text) => {
    try {
      await commentApi.create({
        recipeId,
        content: text,
        parentId,
      });
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      await commentApi.delete(commentId);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">💬 Đánh giá & Bình luận ({comments.length})</h5>

      {user ? (
        <Card className="border-0 shadow-sm p-3 mb-4 bg-light rounded-3">
          <Form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="small fw-semibold text-muted">Đánh giá món ăn:</span>
              <div className="d-flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className="cursor-pointer text-warning"
                    style={{ cursor: 'pointer' }}
                  >
                    {star <= rating ? <StarFill size={18} /> : <Star size={18} />}
                  </span>
                ))}
              </div>
              <span className="small text-warning fw-bold ms-1">({rating} sao)</span>
            </div>

            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn sau khi nấu món này (gia vị, độ khó, hình ảnh...)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="mb-3"
            />

            <Button
              type="submit"
              variant="primary"
              className="btn-cookio-primary px-4 fw-semibold"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi nhận xét'}
            </Button>
          </Form>
        </Card>
      ) : (
        <Alert variant="info" className="small">
          Vui lòng <strong>đăng nhập</strong> để để lại bình luận và đánh giá cho món ăn này.
        </Alert>
      )}

      {comments.length === 0 ? (
        <p className="text-muted small text-center py-3">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận!
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
