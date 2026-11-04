import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Dash, Plus } from 'react-bootstrap-icons';

export default function ServingsCalculator({ baseServings = 4, currentServings = 4, onServingsChange }) {
  const handleDecrease = () => {
    if (currentServings > 1) {
      onServingsChange(currentServings - 1);
    }
  };

  const handleIncrease = () => {
    if (currentServings < 20) {
      onServingsChange(currentServings + 1);
    }
  };

  const scaleFactor = (currentServings / baseServings).toFixed(2);

  return (
    <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 mb-3 border">
      <div>
        <span className="fw-semibold me-2">Khẩu phần ăn:</span>
        <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 rounded-pill">
          {currentServings} người
        </Badge>
        {currentServings !== baseServings && (
          <small className="text-muted ms-2">
            (Tỷ lệ: ×{scaleFactor})
          </small>
        )}
      </div>

      <div className="d-flex align-items-center gap-2">
        <Button
          variant="outline-secondary"
          size="sm"
          className="rounded-circle d-flex align-items-center justify-content-center p-0"
          style={{ width: '32px', height: '32px' }}
          onClick={handleDecrease}
          disabled={currentServings <= 1}
        >
          <Dash size={20} />
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-circle d-flex align-items-center justify-content-center p-0"
          style={{ width: '32px', height: '32px' }}
          onClick={handleIncrease}
          disabled={currentServings >= 20}
        >
          <Plus size={20} />
        </Button>
      </div>
    </div>
  );
}
