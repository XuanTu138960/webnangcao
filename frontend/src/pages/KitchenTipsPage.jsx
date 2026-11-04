import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const tips = [
  {
    title: 'Cách xào thịt bò mềm ngọt không bị ra nước',
    category: 'Mẹo xào',
    icon: '🥩',
    content:
      'Thái thịt bò ngang thớ thật mỏng. Ướp với dầu ăn và một chút bột bắp (hoặc bột năng) trong 15 phút. Khi xào, bật lửa cực lớn, chảo thật nóng, đảo nhanh tay trong 1.5 - 2 phút rồi trút ra ngay.',
  },
  {
    title: 'Bí quyết nấu nước dùng phở bò trong vắt, thơm lừng',
    category: 'Mẹo hầm canh',
    icon: '🥣',
    content:
      'Xương bò phải nướng vàng và chần qua nước sôi rửa sạch huyết trước khi ninh. Không đậy vung khi ninh, vớt bọt liên tục và nướng thơm hành tím, gừng, hoa hồi, quế trước khi thả vào nồi nước dùng.',
  },
  {
    title: 'Cách luộc gà da vàng giòn óng ả chuẩn tiệc',
    category: 'Mẹo luộc/hấp',
    icon: '🍗',
    content:
      'Cho gà vào nồi nước lạnh ngập con gà cùng hành khô và gừng đập dập. Đun sôi rồi hạ nhỏ lửa đun 15 phút, sau đó tắt bếp ủ gà 20 phút. Vớt gà ra ngâm ngay vào âu nước đá lạnh 5 phút rồi quét một lớp mỡ nghệ.',
  },
  {
    title: 'Mẹo chiên cá, chiên đậu không bao giờ bị dính chảo',
    category: 'Mẹo chiên',
    icon: '🐟',
    content:
      'Làm nóng chảo thật khô trước khi cho dầu. Dùng một lát gừng tươi chà xát đều khắp mặt lòng chảo trước khi rót dầu vào. Để dầu thật sôi mới hạ cá vào và tuyệt đối không lật mặt cá khi cá chưa se vàng.',
  },
  {
    title: 'Khử mùi tanh của các loại cá sông và hải sản',
    category: 'Sơ chế nguyên liệu',
    icon: '🦐',
    content:
      'Dùng nước vo gạo hoặc rượu trắng kết hợp gừng giã nát để ngâm rửa cá trong 5-10 phút. Đối với ốc và hến, ngâm với nước vo gạo và vài lát ớt hiểm để nhả sạch bùn cát nhanh chóng.',
  },
  {
    title: 'Cách bảo quản rau củ tươi xanh suốt 2 tuần trong tủ lạnh',
    category: 'Bảo quản thực phẩm',
    icon: '🥦',
    content:
      'Không rửa rau trước khi cho vào tủ lạnh nếu chưa dùng ngay. Bọc rau vào giấy ăn khô để hút ẩm, sau đó đặt vào túi zip hoặc hộp kín có nắp đậy. Để ở ngăn mát dưới cùng của tủ lạnh.',
  },
];

export default function KitchenTipsPage() {
  return (
    <Container className="py-4">
      <div className="text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
          Cẩm nang ẩm thực
        </span>
        <h2 className="fw-bold">💡 100+ Mẹo Nấu Ăn Bất Bại Từ Các Bếp Trưởng</h2>
        <p className="text-muted">
          Những bí kíp nhà bếp gia truyền giúp bạn biến mọi món ăn trở nên hấp dẫn, giữ trọn vẹn hương vị và tiết kiệm tối đa thời gian.
        </p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {tips.map((tip, idx) => (
          <Col key={idx}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-2">{tip.icon}</span>
                <Badge bg="light" text="dark" className="border px-2 py-1 rounded-pill">
                  {tip.category}
                </Badge>
              </div>
              <h5 className="fw-bold mb-3">{tip.title}</h5>
              <p className="text-secondary small leading-relaxed flex-grow-1">
                {tip.content}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
