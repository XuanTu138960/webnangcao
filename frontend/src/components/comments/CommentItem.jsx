import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { StarFill, Reply } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';

export default function CommentItem({ comment, onReply, onDelete }) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  const isAuthor = user?.id === comment.authorId || user?.role === 'admin';

  return (
    <Card className="border-0 bg-light mb-3 p-3 rounded-3 shadow-none">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center gap-2">
          <img
            src={comment.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
            alt={comment.author?.fullName}
            className="rounded-circle border"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
          <div>
            <div className="fw-bold small">{comment.author?.fullName || 'Người dùng'}</div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {comment.rating && (
          <div className="text-warning small d-flex gap-1">
            {[...Array(comment.rating)].map((_, i) => (
              <StarFill key={i} size={12} />
            ))}
          </div>
        )}
      </div>

      <p className="mb-2 text-dark small" style={{ whiteSpace: 'pre-line' }}>
        {comment.content}
      </p>

      <div className="d-flex gap-3 align-items-center">
        {user && (
          <Button
            variant="link"
            size="sm"
            className="p-0 text-decoration-none text-muted small d-flex align-items-center gap-1"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <Reply /> Trả lời
          </Button>
        )}

        {isAuthor && (
          <Button
            variant="link"
            size="sm"
            className="p-0 text-decoration-none text-danger small"
            onClick={() => onDelete(comment.id)}
          >
            Xóa
          </Button>
        )}
      </div>

      {showReplyForm && (
        <Form onSubmit={handleSendReply} className="mt-3 ps-3 border-start border-2 border-warning">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Viết câu trả lời..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mb-2"
            autoFocus
          />
          <div className="d-flex gap-2">
            <Button type="submit" size="sm" variant="primary" className="btn-cookio-primary px-3">
              Gửi
            </Button>
            <Button
              type="button"
              size="sm"
              variant="light"
              onClick={() => setShowReplyForm(false)}
            >
              Hủy
            </Button>
          </div>
        </Form>
      )}

      {/* Render nested replies if any */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ps-3 border-start border-2 border-secondary border-opacity-25 d-flex flex-column gap-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-white p-2 rounded-2 border">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold small">{reply.author?.fullName || 'Người dùng'}</span>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                </small>
              </div>
              <p className="mb-1 text-dark small">{reply.content}</p>
              {(user?.id === reply.authorId || user?.role === 'admin') && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-danger small text-decoration-none"
                  onClick={() => onDelete(reply.id)}
                >
                  Xóa
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
