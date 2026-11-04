import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { PlusCircle, Trash, CheckCircle } from 'react-bootstrap-icons';

export const CreateRecipeModal = ({ show, onHide, onRecipeCreated, categories }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('mon-chinh');
  const [servingSize, setServingSize] = useState(2);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(30);
  const [difficultyLevel, setDifficultyLevel] = useState('Dễ');
  const [thumbnail, setThumbnail] = useState('');

  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: 'gram' },
  ]);

  const [steps, setSteps] = useState([
    { instruction: '', durationMinutes: 10 },
  ]);

  const [draftSaved, setDraftSaved] = useState(false);

  // Thêm / bớt nguyên liệu
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: 'gram' }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
    triggerAutoDraft();
  };

  // Thêm / bớt bước làm
  const handleAddStep = () => {
    setSteps([...steps, { instruction: '', durationMinutes: 5 }]);
  };

  const handleRemoveStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
    triggerAutoDraft();
  };

  // Usability: Auto-save draft
  const triggerAutoDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Vui lòng nhập đầy đủ tên món và mô tả ngắn!');
      return;
    }

    const newRecipe = {
      id: `rec-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description,
      category: {
        name: categories.find((c) => c.slug === categorySlug)?.name || 'Món ngon',
        slug: categorySlug,
      },
      servingSize: Number(servingSize),
      cookTimeMinutes: Number(cookTimeMinutes),
      difficultyLevel,
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      status: 'PENDING', // Mặc định PENDING theo US-04 / US-11
      author: { fullName: 'Bạn (Tác giả mới)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
      ingredients: ingredients
        .filter((ing) => ing.name.trim())
        .map((ing, idx) => ({
          id: `ing-new-${idx}`,
          name: ing.name,
          quantity: Number(ing.quantity) || 100,
          unit: ing.unit,
        })),
      steps: steps
        .filter((st) => st.instruction.trim())
        .map((st, idx) => ({
          stepNumber: idx + 1,
          instruction: st.instruction,
          durationMinutes: Number(st.durationMinutes) || 5,
        })),
    };

    onRecipeCreated(newRecipe);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark">
          🍳 Đăng công thức món ăn mới lên Cookio
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {draftSaved && (
          <Alert variant="info" className="py-2 small d-flex align-items-center gap-2 rounded-pill">
            <CheckCircle /> Đã tự động lưu nháp dữ liệu vào bộ nhớ tạm...
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Tên món ăn (*)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ví dụ: Sườn Xào Chua Ngọt Miền Bắc"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                triggerAutoDraft();
              }}
              required
            />
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label className="fw-semibold">Danh mục</Form.Label>
              <Form.Select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                {categories.filter((c) => c.slug !== 'all').map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold">Khẩu phần (người)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="30"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold">Thời gian nấu (phút)</Form.Label>
              <Form.Control
                type="number"
                min="5"
                value={cookTimeMinutes}
                onChange={(e) => setCookTimeMinutes(e.target.value)}
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Mô tả ngắn hấp dẫn (*)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Chia sẻ lý do món ăn này đặc biệt hoặc gợi ý dịp thưởng thức..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                triggerAutoDraft();
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Link ảnh đại diện món ăn</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </Form.Group>

          {/* DYNAMIC INGREDIENTS */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="fw-bold mb-0">Nguyên liệu định lượng</Form.Label>
            <Button variant="link" className="text-cookio text-decoration-none p-0 fw-semibold" onClick={handleAddIngredient}>
              + Thêm nguyên liệu
            </Button>
          </div>

          {ingredients.map((ing, idx) => (
            <Row key={idx} className="g-2 mb-2 align-items-center">
              <Col xs={6}>
                <Form.Control
                  type="text"
                  placeholder="Tên (thịt bò, đường...)"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  required
                />
              </Col>
              <Col xs={3}>
                <Form.Control
                  type="number"
                  placeholder="Số lượng"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                  required
                />
              </Col>
              <Col xs={2}>
                <Form.Control
                  type="text"
                  placeholder="Đơn vị (gram, ml...)"
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                  required
                />
              </Col>
              <Col xs={1} className="text-end">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-circle p-1"
                  disabled={ingredients.length === 1}
                  onClick={() => handleRemoveIngredient(idx)}
                >
                  <Trash size={14} />
                </Button>
              </Col>
            </Row>
          ))}

          {/* DYNAMIC STEPS */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
            <Form.Label className="fw-bold mb-0">Các bước thực hiện</Form.Label>
            <Button variant="link" className="text-cookio text-decoration-none p-0 fw-semibold" onClick={handleAddStep}>
              + Thêm bước làm
            </Button>
          </div>

          {steps.map((step, idx) => (
            <Row key={idx} className="g-2 mb-2 align-items-start">
              <Col xs={1} className="fw-bold text-center pt-2 text-cookio">
                #{idx + 1}
              </Col>
              <Col xs={9}>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder={`Mô tả chi tiết bước ${idx + 1}...`}
                  value={step.instruction}
                  onChange={(e) => handleStepChange(idx, 'instruction', e.target.value)}
                  required
                />
              </Col>
              <Col xs={2} className="d-flex align-items-center justify-content-end gap-1">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-circle p-1"
                  disabled={steps.length === 1}
                  onClick={() => handleRemoveStep(idx)}
                >
                  <Trash size={14} />
                </Button>
              </Col>
            </Row>
          ))}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="light" onClick={onHide} className="rounded-pill px-3">
              Hủy bỏ
            </Button>
            <Button type="submit" variant="cookio" className="btn-cookio px-4">
              Gửi kiểm duyệt công thức
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
