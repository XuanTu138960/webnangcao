import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { People, Book, ChatDots, Eye, HeartFill, ShieldCheck } from 'react-bootstrap-icons';
import { adminApi } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        setStats(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 text-danger d-flex align-items-center gap-2">
            <ShieldCheck /> Bảng Điều Khiển Quản Trị Viên (Admin)
          </h3>
          <p className="text-muted small mb-0">Hệ thống giám sát và quản lý dữ liệu Cookio</p>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/admin/recipes" variant="outline-primary" size="sm" className="rounded-pill">
            Quản lý món ăn
          </Button>
          <Button as={Link} to="/admin/users" variant="outline-success" size="sm" className="rounded-pill">
            Quản lý người dùng
          </Button>
          <Button as={Link} to="/admin/comments" variant="outline-warning" size="sm" className="rounded-pill">
            Quản lý bình luận
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={4} sm={6}>
          <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-primary bg-opacity-10 rounded-circle text-primary fs-3">
                <People />
              </div>
              <div>
                <small className="text-muted fw-semibold">Tổng người dùng</small>
                <h3 className="fw-bold mb-0">{stats?.totalUsers || 0}</h3>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={4} sm={6}>
          <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-warning fs-3">
                <Book />
              </div>
              <div>
                <small className="text-muted fw-semibold">Tổng công thức</small>
                <h3 className="fw-bold mb-0">{stats?.totalRecipes || 0}</h3>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={4} sm={6}>
          <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-success bg-opacity-10 rounded-circle text-success fs-3">
                <ChatDots />
              </div>
              <div>
                <small className="text-muted fw-semibold">Tổng bình luận</small>
                <h3 className="fw-bold mb-0">{stats?.totalComments || 0}</h3>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={6} sm={6}>
          <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-info bg-opacity-10 rounded-circle text-info fs-3">
                <Eye />
              </div>
              <div>
                <small className="text-muted fw-semibold">Tổng lượt xem món</small>
                <h3 className="fw-bold mb-0">{(stats?.totalViews || 0).toLocaleString()}</h3>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={6} sm={6}>
          <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-danger bg-opacity-10 rounded-circle text-danger fs-3">
                <HeartFill />
              </div>
              <div>
                <small className="text-muted fw-semibold">Tổng lượt yêu thích</small>
                <h3 className="fw-bold mb-0">{(stats?.totalLikes || 0).toLocaleString()}</h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Recipes Table */}
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <h5 className="fw-bold mb-3">Món Ăn Mới Đăng Gần Đây</h5>
        <Table responsive hover className="align-middle small">
          <thead className="table-light">
            <tr>
              <th>Tên món</th>
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Lượt xem</th>
              <th>Lượt thích</th>
              <th>Ngày đăng</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentRecipes || []).map((r) => (
              <tr key={r.id}>
                <td className="fw-semibold">
                  <Link to={`/recipes/${r.id}`} className="text-dark text-decoration-none">
                    {r.title}
                  </Link>
                </td>
                <td>{r.author?.fullName}</td>
                <td><span className="badge bg-light text-dark border">{r.category}</span></td>
                <td>{r.viewsCount}</td>
                <td>❤️ {r.likesCount}</td>
                <td>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
