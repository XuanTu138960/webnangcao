import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ page, limit: 15 });
      setUsers(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleUserStatus(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Quản Lý Người Dùng ({total})</h3>
          <p className="text-muted small mb-0">Quản lý trạng thái và quyền hạn tài khoản</p>
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
                <th>Họ tên</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Công thức</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold">{u.fullName}</td>
                  <td>@{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge bg={u.role === 'admin' ? 'danger' : 'secondary'}>
                      {u.role === 'admin' ? 'Admin' : 'Thành viên'}
                    </Badge>
                  </td>
                  <td>{u.recipesCount || 0}</td>
                  <td>
                    <Badge bg={u.isActive ? 'success' : 'danger'}>
                      {u.isActive ? 'Hoạt động' : 'Bị khóa'}
                    </Badge>
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <Button
                        variant={u.isActive ? 'outline-danger' : 'outline-success'}
                        size="sm"
                        className="rounded-pill px-2 py-0"
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.isActive ? 'Khóa TK' : 'Mở khóa'}
                      </Button>
                    )}
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
