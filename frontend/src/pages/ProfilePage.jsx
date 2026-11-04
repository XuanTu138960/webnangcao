import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import RecipeGrid from '../components/recipes/RecipeGrid';

export default function ProfilePage() {
  const { username: paramUsername } = useParams();
  const { user: currentUser } = useAuth();
  const targetUsername = paramUsername || currentUser?.username;

  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState('');

  const isSelf = currentUser?.username === targetUsername;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userApi.getProfile(targetUsername);
      setProfile(res);
      setFollowing(res.isFollowing || false);

      const recipesRes = await userApi.getUserRecipes(targetUsername);
      setRecipes(recipesRes.data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetUsername) fetchProfile();
  }, [targetUsername]);

  const handleToggleFollow = async () => {
    if (!currentUser) return alert('Vui lòng đăng nhập!');
    try {
      if (following) {
        await userApi.unfollow(profile.id);
        setFollowing(false);
        setProfile({ ...profile, followersCount: Math.max(0, profile.followersCount - 1) });
      } else {
        await userApi.follow(profile.id);
        setFollowing(true);
        setProfile({ ...profile, followersCount: (profile.followersCount || 0) + 1 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Không tìm thấy người dùng'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Profile Header */}
      <Card className="border-0 shadow-sm p-4 rounded-4 mb-4 bg-white">
        <Row className="align-items-center gy-3">
          <Col xs="auto">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={profile.fullName}
              className="rounded-circle border border-3 border-warning shadow-sm"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </Col>
          <Col>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-1">
              <h3 className="fw-bold mb-0">{profile.fullName}</h3>
              {profile.role === 'admin' && (
                <span className="badge bg-danger">Quản trị viên</span>
              )}
            </div>
            <p className="text-muted small mb-2">@{profile.username}</p>
            <p className="small mb-3 text-secondary" style={{ maxWidth: '600px' }}>
              {profile.bio || 'Thành viên cộng đồng đầu bếp Cookio.'}
            </p>

            {/* Follow stats */}
            <div className="d-flex gap-4 small">
              <div>
                <strong>{recipes.length}</strong> <span className="text-muted">công thức</span>
              </div>
              <div>
                <strong>{profile.followersCount || 0}</strong> <span className="text-muted">người theo dõi</span>
              </div>
              <div>
                <strong>{profile.followingCount || 0}</strong> <span className="text-muted">đang theo dõi</span>
              </div>
            </div>
          </Col>

          {!isSelf && (
            <Col xs="auto">
              <Button
                variant={following ? 'outline-secondary' : 'primary'}
                className={`rounded-pill px-4 fw-semibold ${!following ? 'btn-cookio-primary' : ''}`}
                onClick={handleToggleFollow}
              >
                {following ? 'Đang theo dõi' : '+ Theo dõi'}
              </Button>
            </Col>
          )}
        </Row>
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="recipes" className="mb-4">
        <Tab eventKey="recipes" title={`Món đã đăng (${recipes.length})`}>
          <RecipeGrid recipes={recipes} />
        </Tab>
      </Tabs>
    </Container>
  );
}
