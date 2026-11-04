import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash } from 'react-bootstrap-icons';
import { recipeApi } from '../services/api';

const categories = [
  'Món xào',
  'Món chiên',
  'Món kho',
  'Món canh',
  'Món hấp',
  'Món chay',
  'Món chính',
  'Món tráng miệng',
  'Món nước',
  'Bánh',
];

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Món chính',
    cookTime: 30,
    prepTime: 15,
    servings: 4,
    difficulty: 'Trung bình',
    dietaryTags: '',
    calories: 350,
    thumbnail: '',
  });

  const [ingredients, setIngredients] = useState([
    '500g Thịt bò tươi thái mỏng',
    '1 củ Hành tây bổ múi cau',
    '3 tép Tỏi băm nhỏ',
    '2 thìa Dầu hào',
  ]);

  const [instructions, setInstructions] = useState([
    'Ướp thịt bò với tỏi, dầu hào, tiêu trong 15 phút cho ngấm đều gia vị.',
    'Bật bếp lửa to, cho 2 thìa dầu ăn vào phi thơm tỏi băm.',
    'Trút thịt bò vào đảo nhanh tay trong 2 phút rồi đổ riêng ra đĩa.',
    'Xào hành tây vừa chín tới, đổ thịt bò vào đảo đều 30 giây rồi tắt bếp.',
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ingredients handlers
  const handleIngredientChange = (index, value) => {
    const list = [...ingredients];
    list[index] = value;
    setIngredients(list);
  };
  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

  // Instructions handlers
  const handleInstructionChange = (index, value) => {
    const list = [...instructions];
    list[index] = value;
    setInstructions(list);
  };
  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanIngs = ingredients.filter((i) => i.trim());
    if (cleanIngs.length === 0) return setError('Vui lòng nhập ít nhất 1 nguyên liệu');

    const cleanSteps = instructions.filter((s) => s.trim());
    if (cleanSteps.length === 0) return setError('Vui lòng nhập ít nhất 1 bước hướng dẫn');

    setLoading(true);
    try {
      const payload = {
        ...formData,
        cookTime: Number(formData.cookTime),
        prepTime: Number(formData.prepTime),
        servings: Number(formData.servings),
        calories: Number(formData.calories),
        ingredients: cleanIngs.join('\n'),
        instructions: cleanSteps.join('\n'),
        thumbnail:
          formData.thumbnail.trim() ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      };

      const res = await recipeApi.create(payload);
      if (res && res.id) {
        navigate(`/recipes/${res.id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Không thể tạo công thức, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '850px' }}>
      <Card className="border-0 shadow-sm p-4 rounded-4 bg-white">
        <h3 className="fw-bold mb-1">📝 Đăng Tải Công Thức Món Ăn Mới</h3>
        <p className="text-muted small mb-4">
          Chia sẻ niềm đam mê ẩm thực của bạn với cộng đồng Cookio Việt Nam!
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Tên món ăn *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="VD: Canh chua cá lóc Nam Bộ chuẩn vị mẹ nấu"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Mô tả ngắn gọn về món ăn *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              placeholder="Hương vị thơm ngon, cách nấu đơn giản phù hợp cho bữa cơm gia đình cuối tuần..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="gy-3 mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold">Danh mục món</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label className="fw-bold">Độ khó</Form.Label>
              <Form.Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="gy-3 mb-3">
            <Col sm={4}>
              <Form.Label className="fw-bold">Chuẩn bị (phút)</Form.Label>
              <Form.Control
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                min={1}
              />
            </Col>
            <Col sm={4}>
              <Form.Label className="fw-bold">Nấu (phút)</Form.Label>
              <Form.Control
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                min={1}
              />
            </Col>
            <Col sm={4}>
              <Form.Label className="fw-bold">Khẩu phần (người)</Form.Label>
              <Form.Control
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                min={1}
              />
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Ảnh đại diện món ăn (URL)</Form.Label>
            <Form.Control
              type="url"
              name="thumbnail"
              placeholder="https://images.unsplash.com/... (để trống sẽ dùng ảnh mặc định)"
              value={formData.thumbnail}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Dynamic Ingredients */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="fw-bold mb-0">🛒 Danh sách nguyên liệu *</Form.Label>
              <Button variant="outline-primary" size="sm" onClick={addIngredient} className="rounded-pill">
                <Plus /> Thêm nguyên liệu
              </Button>
            </div>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="d-flex gap-2 mb-2">
                <Form.Control
                  type="text"
                  placeholder={`Nguyên liệu ${idx + 1}`}
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  required
                />
                {ingredients.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeIngredient(idx)}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Instructions */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="fw-bold mb-0">👨‍🍳 Các bước nấu ăn *</Form.Label>
              <Button variant="outline-primary" size="sm" onClick={addInstruction} className="rounded-pill">
                <Plus /> Thêm bước
              </Button>
            </div>
            {instructions.map((step, idx) => (
              <div key={idx} className="d-flex gap-2 mb-2 align-items-start">
                <span className="badge bg-secondary p-2 mt-1">{idx + 1}</span>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder={`Mô tả chi tiết bước ${idx + 1}...`}
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  required
                />
                {instructions.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeInstruction(idx)}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Mẹo nấu & Lưu ý</Form.Label>
            <Form.Control
              type="text"
              name="dietaryTags"
              placeholder="VD: Không nên mở vung khi hầm cá; lửa to khi xào thịt..."
              value={formData.dietaryTags}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 rounded-pill py-3 fw-bold btn-cookio-primary shadow"
            disabled={loading}
          >
            {loading ? 'Đang lưu công thức...' : '🚀 Đăng tải công thức ngay'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
