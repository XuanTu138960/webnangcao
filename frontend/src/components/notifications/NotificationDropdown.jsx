import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Button, Spinner } from 'react-bootstrap';
import { Bell } from 'react-bootstrap-icons';
import { notificationApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getAll();
      if (res) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Lỗi tải thông báo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling 1 min
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationApi.markAsRead(notif.id);
        setUnreadCount((c) => Math.max(0, c - 1));
        setNotifications(
          notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
        );
      } catch (err) {
        console.error(err);
      }
    }
    if (notif.referenceType === 'recipe' && notif.referenceId) {
      navigate(`/recipes/${notif.referenceId}`);
    } else if (notif.actor?.username) {
      navigate(`/profile/${notif.actor.username}`);
    }
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        as="div"
        className="position-relative cursor-pointer p-2 text-dark"
        style={{ cursor: 'pointer' }}
      >
        <Bell size={22} className="text-secondary" />
        {unreadCount > 0 && (
          <Badge
            pill
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.65rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="shadow-lg border-0 p-0"
        style={{ width: '320px', maxHeight: '420px', overflowY: 'auto' }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
          <span className="fw-bold">Thông báo ({unreadCount})</span>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-none small"
              onClick={handleMarkAllRead}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </div>

        {loading && notifications.length === 0 ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            Không có thông báo mới nào
          </div>
        ) : (
          notifications.map((n) => (
            <Dropdown.Item
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-3 border-bottom text-wrap ${
                !n.isRead ? 'bg-light-primary fw-medium' : ''
              }`}
              style={{ fontSize: '0.85rem' }}
            >
              <div className="d-flex align-items-start gap-2">
                <span className="fs-6">
                  {n.type === 'like'
                    ? '❤️'
                    : n.type === 'comment'
                    ? '💬'
                    : n.type === 'follow'
                    ? '👤'
                    : '🍳'}
                </span>
                <div className="flex-grow-1">
                  <div>
                    <strong>{n.actor?.fullName || 'Người dùng'}</strong> {n.message}
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                  </small>
                </div>
              </div>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
