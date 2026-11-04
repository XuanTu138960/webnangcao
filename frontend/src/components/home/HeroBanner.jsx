import React from 'react';
import { Carousel, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  const slides = [
    {
      title: 'Khám Phá Hơn 10,000+ Món Ngon Việt Nam',
      description: 'Học nấu ăn từng bước với hướng dẫn chi tiết, hình ảnh sống động và mẹo vặt hữu ích từ các đầu bếp gia đình.',
      badge: 'Bộ sưu tập Cookio',
      bgImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80',
      actionText: 'Khám phá ngay',
      actionLink: '/?sort=popular',
      variant: 'primary',
    },
    {
      title: 'Tủ Lạnh Thông Minh - Nấu Ngon Với Đồ Có Sẵn',
      description: 'Chỉ cần chọn nguyên liệu đang có trong bếp, Cookio sẽ gợi ý ngay các món ăn phù hợp nhất cho bữa cơm nhà bạn.',
      badge: 'Tính năng độc quyền',
      bgImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&auto=format&fit=crop&q=80',
      actionText: 'Mở tủ lạnh ngay',
      actionLink: '/smart-fridge',
      variant: 'warning',
    },
    {
      title: 'Bí Quyết Nhà Bếp & Thực Đơn 7 Ngày',
      description: 'Lên thực đơn tuần khoa học, cân đối dinh dưỡng và những mẹo nhỏ giúp công việc bếp núc trở nên thảnh thơi hơn bao giờ hết.',
      badge: 'Mẹo ẩm thực',
      bgImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&auto=format&fit=crop&q=80',
      actionText: 'Xem mẹo nấu ăn',
      actionLink: '/kitchen-tips',
      variant: 'success',
    },
  ];

  return (
    <Carousel className="cookio-hero-carousel shadow-sm rounded-4 overflow-hidden mb-4">
      {slides.map((slide, index) => (
        <Carousel.Item key={index} interval={4500} style={{ maxHeight: '380px' }}>
          <div
            className="w-100 d-flex align-items-center"
            style={{
              height: '380px',
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%), url(${slide.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Container className="px-4 px-md-5">
              <div style={{ maxWidth: '620px' }}>
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">
                  {slide.badge}
                </span>
                <h1 className="text-white fw-bold display-6 mb-3">
                  {slide.title}
                </h1>
                <p className="text-light opacity-90 mb-4 fs-6">
                  {slide.description}
                </p>
                <Button
                  as={Link}
                  to={slide.actionLink}
                  variant="primary"
                  size="lg"
                  className="rounded-pill px-4 fw-bold shadow btn-cookio-primary"
                >
                  {slide.actionText} →
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
