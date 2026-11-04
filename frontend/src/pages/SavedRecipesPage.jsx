import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { userApi } from '../services/api';
import RecipeGrid from '../components/recipes/RecipeGrid';

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await userApi.getSavedRecipes();
      setRecipes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">🔖 Sổ Tay Món Ngon Đã Lưu</h3>
        <p className="text-muted small">
          Tất cả những công thức bạn đã lưu lại để trổ tài khi có dịp.
        </p>
      </div>

      <RecipeGrid
        recipes={recipes}
        loading={loading}
        onActionSuccess={fetchSaved}
      />
    </Container>
  );
}
