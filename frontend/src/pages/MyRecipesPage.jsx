import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import RecipeGrid from '../components/recipes/RecipeGrid';

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRecipes = async () => {
    if (!user?.username) return;
    try {
      setLoading(true);
      const res = await userApi.getUserRecipes(user.username);
      setRecipes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, [user]);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">🍳 Công Thức Của Tôi</h3>
          <p className="text-muted small mb-0">
            Quản lý tất cả những món ăn bạn đã chia sẻ lên Cookio ({recipes.length} món).
          </p>
        </div>
        <Button
          as={Link}
          to="/recipes/create"
          variant="primary"
          className="rounded-pill px-4 fw-semibold d-flex align-items-center gap-2 btn-cookio-primary"
        >
          <PlusCircle /> Tạo công thức mới
        </Button>
      </div>

      <RecipeGrid
        recipes={recipes}
        loading={loading}
        onActionSuccess={fetchMyRecipes}
      />
    </Container>
  );
}
