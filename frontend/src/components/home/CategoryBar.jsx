import React from 'react';
import { Button } from 'react-bootstrap';

const categories = [
  { name: 'Tất cả', icon: '🍲' },
  { name: 'Món xào', icon: '🥘' },
  { name: 'Món chiên', icon: '🍗' },
  { name: 'Món kho', icon: '🍲' },
  { name: 'Món canh', icon: '🥣' },
  { name: 'Món hấp', icon: '🥟' },
  { name: 'Món chay', icon: '🥗' },
  { name: 'Món chính', icon: '🍛' },
];

export default function CategoryBar({ selectedCategory = 'Tất cả', onSelectCategory }) {
  return (
    <div className="category-scroll-container d-flex gap-2 overflow-auto py-2 mb-4">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <Button
            key={cat.name}
            variant={isSelected ? 'primary' : 'light'}
            className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill text-nowrap fw-semibold border shadow-none ${
              isSelected ? 'btn-cookio-primary text-white border-0' : 'bg-white text-secondary'
            }`}
            onClick={() => onSelectCategory(cat.name)}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
