import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getComments({ page, limit: 15 });
      setComments(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page]);

  const handleToggleVisibility = async (id) => {
    try {
      await adminApi.toggleCommentVisibility(id);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Quản Lý Bình Luận ({total})</h3>
          <p className="text-muted small mb-0">Kiểm duyệt các ý kiến đóng góp từ thành viên</p>
        </div>
        <Link to="/admin" className="btn btn-outline-secondary btn-sm rounded-pill">
          ← Quay lại Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="bg-white rounded-4 shadow-sm p-3">
          <Table responsive hover className="align-middle small">
            <thead className="table-light">
              <tr>
                <th>Người gửi</th>
                <th>Công thức</th>
                <th>Nội dung bình luận</th>
                <th>Đánh giá</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c.id}>
                  <td className="fw-semibold">{c.author?.fullName || 'N/A'}</td>
                  <td>
                    <Link to={`/recipes/${c.recipeId}`} className="text-dark text-decoration-none small">
                      {c.recipe?.title || c.recipeId}
                    </Link>
                  </td>
                  <td style={{ maxWidth: '300px' }}>{c.content}</td>
                  <td>{c.rating ? `⭐ ${c.rating}` : '-'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Badge bg={c.isVisible ? 'success' : 'secondary'}>
                      {c.isVisible ? 'Hiển thị' : 'Đã ẩn'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={c.isVisible ? 'outline-danger' : 'outline-success'}
                      size="sm"
                      className="rounded-pill px-2 py-0"
                      onClick={() => handleToggleVisibility(c.id)}
                    >
                      {c.isVisible ? 'Ẩn' : 'Hiện'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination size="sm">
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === page}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
