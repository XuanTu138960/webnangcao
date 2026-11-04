import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getRecipes({ page, limit: 15 });
      setRecipes(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page]);

  const handleTogglePublish = async (id) => {
    try {
      await adminApi.togglePublish(id);
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await adminApi.toggleFeatured(id);
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Quản Lý Công Thức ({total})</h3>
          <p className="text-muted small mb-0">Kiểm duyệt và gắn nhãn nổi bật cho công thức</p>
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
                <th>Ảnh</th>
                <th>Tên món ăn</th>
                <th>Tác giả</th>
                <th>Danh mục</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <img
                      src={r.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'}
                      alt={r.title}
                      className="rounded"
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                  </td>
                  <td className="fw-semibold">
                    <Link to={`/recipes/${r.id}`} className="text-dark text-decoration-none">
                      {r.title}
                    </Link>
                  </td>
                  <td>{r.author?.fullName || 'N/A'}</td>
                  <td><Badge bg="light" text="dark" className="border">{r.category}</Badge></td>
                  <td>
                    <Button
                      variant={r.isFeatured ? 'warning' : 'outline-secondary'}
                      size="sm"
                      className="rounded-pill px-2 py-0"
                      onClick={() => handleToggleFeatured(r.id)}
                    >
                      {r.isFeatured ? '★ Nổi bật' : '☆ Thường'}
                    </Button>
                  </td>
                  <td>
                    <Badge bg={r.isPublished ? 'success' : 'secondary'}>
                      {r.isPublished ? 'Hiển thị' : 'Đã ẩn'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={r.isPublished ? 'outline-danger' : 'outline-success'}
                      size="sm"
                      className="rounded-pill px-2 py-0"
                      onClick={() => handleTogglePublish(r.id)}
                    >
                      {r.isPublished ? 'Ẩn món' : 'Hiện món'}
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
