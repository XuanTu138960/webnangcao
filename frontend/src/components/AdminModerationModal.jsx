import React from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, Eye } from 'react-bootstrap-icons';

export const AdminModerationModal = ({
  show,
  onHide,
  pendingRecipes,
  onApproveRecipe,
  onRejectRecipe,
  onViewRecipe,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark d-flex align-items-center gap-2">
          <span>🛡️ Bảng điều khiển kiểm duyệt Cookio (US-11)</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-secondary small mb-3">
          Kiểm tra kỹ nội dung, tính an toàn thực phẩm và định lượng nguyên liệu trước khi phê duyệt hiển thị công khai trên trang chủ.
        </p>

        {pendingRecipes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CheckCircleFill size={40} className="text-success mb-2 d-block mx-auto" />
            <div className="fw-semibold">Tất cả bài đăng đã được kiểm duyệt!</div>
            <div className="small">Hiện không còn công thức nào đang ở trạng thái chờ duyệt (PENDING).</div>
          </div>
        ) : (
          <Table responsive hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Tên món ăn</th>
                <th>Tác giả</th>
                <th>Khẩu phần</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingRecipes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="fw-bold text-dark">{r.title}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '240px' }}>
                      {r.description}
                    </div>
                  </td>
                  <td>{r.author?.fullName || 'Người dùng mới'}</td>
                  <td>{r.servingSize} người</td>
                  <td>
                    <Badge bg="warning" text="dark" className="rounded-pill">
                      PENDING
                    </Badge>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <Button
                        variant="light"
                        size="sm"
                        className="rounded-circle p-2"
                        title="Xem trước"
                        onClick={() => onViewRecipe(r)}
                      >
                        <Eye size={15} />
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="rounded-pill px-3 py-1 small fw-semibold"
                        onClick={() => onApproveRecipe(r.id)}
                      >
                        <CheckCircleFill size={13} className="me-1" /> Duyệt
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-2 py-1 small"
                        onClick={() => onRejectRecipe(r.id)}
                      >
                        <XCircleFill size={13} className="me-1" /> Từ chối
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" className="rounded-pill px-4" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
