import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Card, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import CategoryBar from '../components/home/CategoryBar';
import TrendingSection from '../components/home/TrendingSection';
import RecipeSearch from '../components/recipes/RecipeSearch';
import RecipeGrid from '../components/recipes/RecipeGrid';
import { recipeApi } from '../services/api';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentCategory = searchParams.get('category') || 'Tất cả';
  const currentQuery = searchParams.get('q') || '';
  const currentCookingTime = searchParams.get('time') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const fetchTrending = async () => {
    try {
      const res = await recipeApi.getTrending(4);
      setTrendingRecipes(res || []);
    } catch (err) {
      console.error('Lỗi tải trending:', err);
    }
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort: currentSort,
      };
      if (currentCategory && currentCategory !== 'Tất cả') {
        params.category = currentCategory;
      }
      if (currentQuery) {
        params.q = currentQuery;
      }
      if (currentCookingTime) {
        params.maxCookTime = currentCookingTime;
      }

      const res = await recipeApi.getAll(params);
      if (res) {
        setRecipes(res.data || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Lỗi tải công thức:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    fetchRecipes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCategory, currentQuery, currentCookingTime, currentSort, page]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'Tất cả') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setPage(1);
    setSearchParams(newParams);
  };

  return (
    <Container className="py-3">
      {/* Hero Carousel */}
      <HeroBanner />

      {/* Category Bar */}
      <CategoryBar
        selectedCategory={currentCategory}
        onSelectCategory={(cat) => updateParam('category', cat)}
      />

      {/* Trending Section */}
      {!currentQuery && currentCategory === 'Tất cả' && (
        <TrendingSection
          recipes={trendingRecipes}
          onActionSuccess={fetchRecipes}
        />
      )}

      {/* Filter and Search Bar */}
      <RecipeSearch
        searchQuery={currentQuery}
        onSearchChange={(q) => updateParam('q', q)}
        cookingTime={currentCookingTime}
        onCookingTimeChange={(time) => updateParam('time', time)}
        sortBy={currentSort}
        onSortChange={(sort) => updateParam('sort', sort)}
      />

      {/* Main Grid */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0">
          {currentQuery
            ? `Kết quả tìm kiếm cho: "${currentQuery}"`
            : currentCategory !== 'Tất cả'
            ? `Danh mục: ${currentCategory}`
            : 'Tất Cả Món Ngon'}
        </h4>
        <span className="text-muted small">Trang {page} / {totalPages}</span>
      </div>

      <RecipeGrid
        recipes={recipes}
        loading={loading}
        onActionSuccess={fetchRecipes}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
}
