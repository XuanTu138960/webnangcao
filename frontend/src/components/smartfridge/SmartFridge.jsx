import React, { useState } from 'react';
import { Card, Form, Button, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Plus, X, Search } from 'react-bootstrap-icons';
import { recipeApi } from '../../services/api';
import RecipeGrid from '../recipes/RecipeGrid';

const popularIngredients = [
  'Thịt bò',
  'Thịt lợn',
  'Thịt gà',
  'Trứng',
  'Cà chua',
  'Hành tây',
  'Tỏi',
  'Gừng',
  'Đậu phụ',
  'Cà rốt',
  'Khoai tây',
  'Cần tây',
  'Sả',
  'Ớt',
  'Nước mắm',
];

export default function SmartFridge() {
  const [selectedIngredients, setSelectedIngredients] = useState([
    'Thịt bò',
    'Hành tây',
  ]);
  const [customInput, setCustomInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleAddIngredient = (ing) => {
    const clean = ing.trim();
    if (clean && !selectedIngredients.includes(clean)) {
      setSelectedIngredients([...selectedIngredients, clean]);
    }
  };

  const handleRemoveIngredient = (ing) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== ing));
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleAddIngredient(customInput.trim());
      setCustomInput('');
    }
  };

  const handleSearchRecipes = async () => {
    if (selectedIngredients.length === 0) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await recipeApi.smartFridge(selectedIngredients);
      setRecipes(res || []);
    } catch (err) {
      console.error('Lỗi tìm món:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-fridge-container py-2">
      <Card className="border-0 shadow-sm p-4 mb-4 bg-white rounded-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="fs-2">🧊</span>
          <div>
            <h4 className="fw-bold mb-0">Tủ Lạnh Thông Minh Cookio</h4>
            <small className="text-muted">
              Chọn các nguyên liệu có sẵn trong bếp của bạn để tìm ngay các món ăn phù hợp nhất!
            </small>
          </div>
        </div>

        {/* Selected Ingredients Pill List */}
        <div className="mb-3">
          <label className="fw-semibold small text-muted mb-2 d-block">
            Nguyên liệu đã chọn ({selectedIngredients.length}):
          </label>
          <div className="d-flex flex-wrap gap-2 min-vh-25 p-3 bg-light rounded-3 border">
            {selectedIngredients.length === 0 ? (
              <span className="text-muted small">
                Chưa có nguyên liệu nào được chọn. Hãy bấm vào các gợi ý bên dưới hoặc tự nhập thêm!
              </span>
            ) : (
              selectedIngredients.map((ing) => (
                <Badge
                  key={ing}
                  bg="primary"
                  className="px-3 py-2 fs-6 rounded-pill d-flex align-items-center gap-2 bg-opacity-90 btn-cookio-primary"
                >
                  {ing}
                  <X
                    size={18}
                    className="cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveIngredient(ing)}
                  />
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Custom Input */}
        <Form onSubmit={handleCustomAdd} className="d-flex gap-2 mb-4">
          <Form.Control
            type="text"
            placeholder="Tự nhập thêm nguyên liệu (vd: nấm hương, hoa chuối, cốt dừa...)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="rounded-pill ps-3"
          />
          <Button
            type="submit"
            variant="outline-primary"
            className="rounded-pill px-3 d-flex align-items-center gap-1"
          >
            <Plus size={20} /> Thêm
          </Button>
        </Form>

        {/* Popular Ingredients Quick Pick */}
        <div className="mb-4">
          <label className="fw-semibold small text-muted mb-2 d-block">
            Gợi ý nguyên liệu phổ biến trong tủ lạnh:
          </label>
          <div className="d-flex flex-wrap gap-2">
            {popularIngredients.map((ing) => {
              const isSelected = selectedIngredients.includes(ing);
              return (
                <Button
                  key={ing}
                  variant={isSelected ? 'secondary' : 'light'}
                  size="sm"
                  className="rounded-pill px-3 border shadow-none"
                  onClick={() =>
                    isSelected ? handleRemoveIngredient(ing) : handleAddIngredient(ing)
                  }
                >
                  {isSelected ? `✓ ${ing}` : `+ ${ing}`}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Search Action */}
        <Button
          variant="primary"
          size="lg"
          className="w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 btn-cookio-primary shadow"
          onClick={handleSearchRecipes}
          disabled={selectedIngredients.length === 0 || loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Đang tìm kiếm món ngon...
            </>
          ) : (
            <>
              <Search size={18} /> Tìm món nấu ngay với {selectedIngredients.length} nguyên liệu
            </>
          )}
        </Button>
      </Card>

      {/* Results Section */}
      {searched && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              🎉 Gợi ý món ngon phù hợp ({recipes.length})
            </h5>
            <small className="text-muted">Được xếp hạng theo tỷ lệ khớp nguyên liệu</small>
          </div>

          <RecipeGrid recipes={recipes} loading={loading} />
        </div>
      )}
    </div>
  );
}
