import React, { useState } from 'react';
import { Modal, Button, Row, Col, Badge, Table, ListGroup, ProgressBar } from 'react-bootstrap';
import { Clock, People, Printer, PlayFill, CheckCircleFill, ChevronLeft, ChevronRight, XCircle } from 'react-bootstrap-icons';

export const RecipeDetailModal = ({ show, onHide, recipe, isBookmarked, onToggleBookmark }) => {
  const [servings, setServings] = useState(recipe?.servingSize || 2);
  const [focusMode, setFocusMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!recipe) return null;

  // Servings Scaler Logic (Câu 1 US-16, Câu 2b Thuật toán)
  const baseServing = recipe.servingSize || 1;
  const scaleRatio = servings / baseServing;

  const handleDecreaseServings = () => {
    if (servings > 1) setServings(servings - 1);
  };

  const handleIncreaseServings = () => {
    if (servings < 30) setServings(servings + 1);
  };

  const handlePrint = () => {
    window.print();
  };

  // COOKING FOCUS MODE (USABILITY: Tương tác rảnh tay khi làm bếp)
  if (focusMode) {
    const steps = recipe.steps || [];
    const activeStep = steps[currentStepIndex];
    const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

    return (
      <div className="focus-mode-overlay p-4">
        <div className="container py-3 d-flex flex-column h-100" style={{ maxWidth: '800px' }}>
          {/* FOCUS MODE HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold mb-2">
                🍳 Chế độ nấu ăn tập trung (Cooking Focus Mode)
              </Badge>
              <h3 className="fw-bold text-white mb-0">{recipe.title}</h3>
            </div>
            <Button
              variant="outline-light"
              className="rounded-pill d-flex align-items-center gap-1"
              onClick={() => setFocusMode(false)}
            >
              <XCircle size={18} /> <span>Thoát chế độ</span>
            </Button>
          </div>

          <ProgressBar now={progressPercent} variant="warning" className="mb-4" style={{ height: '8px' }} />

          {/* STEP DISPLAY */}
          <div className="flex-grow-1 d-flex flex-column justify-content-center bg-dark bg-opacity-50 p-4 p-md-5 rounded-4 shadow-lg border border-secondary">
            <div className="text-warning fw-bold fs-5 mb-2">
              BƯỚC {currentStepIndex + 1} / {steps.length}
            </div>
            <p className="fs-3 text-white fw-semibold mb-4" style={{ lineHeight: '1.6' }}>
              {activeStep?.instruction}
            </p>

            {activeStep?.durationMinutes && (
              <div className="d-flex align-items-center gap-2 text-info fs-6 mb-3">
                <Clock size={20} />
                <span>Thời gian khuyến nghị: {activeStep.durationMinutes} phút</span>
              </div>
            )}
          </div>

          {/* NAVIGATION FOOTER */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              variant="outline-light"
              size="lg"
              className="rounded-pill px-4"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
            >
              <ChevronLeft /> Bước trước
            </Button>

            <span className="text-white-50">
              Bước {currentStepIndex + 1} trên {steps.length}
            </span>

            {currentStepIndex < steps.length - 1 ? (
              <Button
                variant="cookio"
                size="lg"
                className="btn-cookio px-4"
                onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
              >
                Bước kế tiếp <ChevronRight />
              </Button>
            ) : (
              <Button
                variant="success"
                size="lg"
                className="rounded-pill px-4"
                onClick={() => {
                  alert('Chúc mừng bạn đã hoàn thành món ăn thơm ngon cùng Cookio!');
                  setFocusMode(false);
                }}
              >
                Hoàn thành món ăn 🎉
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable className="recipe-detail-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark">{recipe.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {/* BANNER THUMBNAIL */}
        <div className="position-relative rounded-4 overflow-hidden mb-4">
          <img
            src={recipe.thumbnail || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
            alt={recipe.title}
            className="w-100"
            style={{ maxHeight: '320px', objectFit: 'cover' }}
          />
          <Badge bg="warning" text="dark" className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill fw-bold">
            {recipe.category?.name || 'Món ngon'}
          </Badge>
        </div>

        {/* METRICS & AUTHOR */}
        <Row className="g-3 mb-4 p-3 bg-light rounded-4 text-center">
          <Col xs={4}>
            <div className="text-muted small">Thời gian nấu</div>
            <div className="fw-bold text-dark fs-6 d-flex align-items-center justify-content-center gap-1 mt-1">
              <Clock className="text-cookio" /> {recipe.cookTimeMinutes} phút
            </div>
          </Col>
          <Col xs={4} className="border-start border-end">
            <div className="text-muted small">Độ khó</div>
            <div className="fw-bold text-dark fs-6 mt-1">{recipe.difficultyLevel || 'Dễ'}</div>
          </Col>
          <Col xs={4}>
            <div className="text-muted small">Tác giả</div>
            <div className="fw-bold text-dark fs-6 mt-1 text-truncate">{recipe.author?.fullName || 'Cookio Chef'}</div>
          </Col>
        </Row>

        <p className="text-secondary mb-4">{recipe.description}</p>

        {/* SERVINGS SCALER WIDGET (USABILITY) */}
        <div className="p-3 bg-white border border-warning rounded-4 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <div className="fw-bold text-dark d-flex align-items-center gap-2">
                <People className="text-cookio" size={20} />
                <span>Tùy chỉnh khẩu phần ăn (Servings Scaler)</span>
              </div>
              <div className="small text-muted">
                Định lượng nguyên liệu tự động nhân hệ số: <strong>x{scaleRatio.toFixed(2)}</strong>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                className="rounded-circle fw-bold px-2 py-0"
                style={{ width: '32px', height: '32px' }}
                onClick={handleDecreaseServings}
              >
                -
              </Button>
              <span className="fw-bold fs-5 px-2">{servings} người</span>
              <Button
                variant="outline-secondary"
                size="sm"
                className="rounded-circle fw-bold px-2 py-0"
                style={{ width: '32px', height: '32px' }}
                onClick={handleIncreaseServings}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* INGREDIENTS TABLE */}
        <h5 className="fw-bold text-dark mb-3">Nguyên liệu cần chuẩn bị</h5>
        <Table responsive hover className="align-middle mb-4">
          <thead className="table-light">
            <tr>
              <th>Tên nguyên liệu</th>
              <th className="text-end">Định lượng điều chỉnh</th>
              <th className="text-start ps-3">Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            {(recipe.ingredients || []).map((ing, idx) => {
              const scaledQty = Math.round(ing.quantity * scaleRatio * 100) / 100;
              return (
                <tr key={ing.id || idx}>
                  <td className="fw-semibold">{ing.name}</td>
                  <td className="text-end fw-bold text-cookio">{scaledQty}</td>
                  <td className="text-start ps-3 text-muted">{ing.unit}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* COOKING STEPS */}
        <h5 className="fw-bold text-dark mb-3">Các bước thực hiện chi tiết</h5>
        <ListGroup variant="flush" className="mb-4">
          {(recipe.steps || []).map((step, idx) => (
            <ListGroup.Item key={step.id || idx} className="px-0 py-3 border-light">
              <div className="d-flex gap-3">
                <div
                  className="rounded-circle bg-cookio text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '36px', height: '36px' }}
                >
                  {step.stepNumber || idx + 1}
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark" style={{ lineHeight: '1.6' }}>
                    {step.instruction}
                  </p>
                  {step.durationMinutes && (
                    <span className="small text-muted d-inline-flex align-items-center gap-1">
                      <Clock size={13} /> {step.durationMinutes} phút
                    </span>
                  )}
                  {step.imageAttachment && (
                    <img
                      src={step.imageAttachment}
                      alt={`Bước ${step.stepNumber}`}
                      className="rounded-3 mt-2 d-block"
                      style={{ maxHeight: '180px', objectFit: 'cover' }}
                    />
                  )}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 d-flex justify-content-between">
        <Button variant="outline-secondary" className="rounded-pill d-flex align-items-center gap-1" onClick={handlePrint}>
          <Printer size={16} /> <span>In công thức</span>
        </Button>

        <div className="d-flex gap-2">
          <Button
            variant="cookio"
            className="btn-cookio d-flex align-items-center gap-2 px-4 shadow-sm"
            onClick={() => {
              setCurrentStepIndex(0);
              setFocusMode(true);
            }}
          >
            <PlayFill size={20} /> <span>Bắt đầu nấu (Focus Mode)</span>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
