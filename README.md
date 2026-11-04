# 🍜 Cookio - Website Nấu Ăn Việt Nam

> Dự án môn **Web Nâng Cao** | Đại học Phenikaa  
> Mô phỏng và phát triển dựa trên nền tảng [YummyDay](https://yummyday.vn)

---

## 👨‍🎓 Thông Tin Sinh Viên

| Thông tin | Chi tiết |
|-----------|----------|
| **Họ và tên** | Nguyễn Xuân Tú |
| **Mã sinh viên** | 23010538 |
| **Lớp** | K17_CNTT_6 |
| **Trường** | Đại học Phenikaa |
| **Môn học** | Lập trình Web Nâng Cao |

---

## 📖 Giới Thiệu Dự Án

**Cookio** là nền tảng chia sẻ công thức nấu ăn trực tuyến dành cho người dùng Việt Nam. Website cho phép người dùng khám phá, chia sẻ và lưu trữ các công thức ẩm thực từ khắp mọi miền đất nước. Dự án được xây dựng với kiến trúc hiện đại sử dụng **NestJS** (backend) và **React** (frontend), triển khai qua **Docker**.

---

## ✨ Tính Năng Đầy Đủ (25+ tính năng)

### 🔐 Xác thực & Phân quyền
1. **Đăng ký tài khoản** - Tạo tài khoản mới với email, username, password
2. **Đăng nhập / Đăng xuất** - Xác thực bằng JWT Token
3. **Phân quyền 3 cấp** - Admin / Chef (đầu bếp) / User (người dùng thường)
4. **Bảo vệ route** - Guards bảo vệ các endpoint theo quyền hạn

### 📋 Quản Lý Công Thức
5. **Xem danh sách công thức** - Hiển thị tất cả công thức với phân trang
6. **Xem chi tiết công thức** - Thông tin đầy đủ: nguyên liệu, các bước, thời gian, khẩu phần
7. **Tạo công thức mới** - Form đầy đủ với upload ảnh, thêm nguyên liệu & các bước
8. **Chỉnh sửa công thức** - Cập nhật nội dung công thức đã đăng
9. **Xóa công thức** - Xóa công thức (có quyền)
10. **Tìm kiếm công thức** - Tìm theo tên, nguyên liệu, danh mục

### 🗂️ Danh Mục & Lọc
11. **Danh mục món ăn** - Phân loại theo: Món chính, Món phụ, Tráng miệng, Đồ uống, v.v.
12. **Lọc theo độ khó** - Dễ / Trung bình / Khó
13. **Lọc theo thời gian nấu** - Dưới 30 phút, 30-60 phút, trên 60 phút
14. **Sắp xếp kết quả** - Mới nhất, Phổ biến nhất, Đánh giá cao nhất

### ❤️ Tương Tác Người Dùng
15. **Thích công thức** - Like/Unlike công thức yêu thích
16. **Lưu công thức** - Bookmark để xem lại sau
17. **Bình luận** - Thêm, sửa, xóa bình luận trên công thức
18. **Đánh giá sao** - Chấm điểm công thức từ 1-5 sao

### 👤 Hồ Sơ Người Dùng
19. **Trang hồ sơ cá nhân** - Xem thông tin, ảnh đại diện, các công thức đã đăng
20. **Chỉnh sửa hồ sơ** - Cập nhật tên, bio, ảnh đại diện
21. **Danh sách đã lưu** - Xem tất cả công thức đã bookmark

### 🛠️ Quản Trị (Admin)
22. **Dashboard Admin** - Thống kê tổng quan: users, recipes, comments
23. **Quản lý người dùng** - Xem, khóa/mở khóa, phân quyền tài khoản
24. **Quản lý công thức** - Duyệt, ẩn/hiện, xóa công thức
25. **Quản lý danh mục** - Thêm, sửa, xóa danh mục món ăn

### 📚 API & Tài Liệu
26. **Swagger UI** - Tài liệu API tương tác tại `/docs`
27. **Health Check** - Endpoint kiểm tra trạng thái server tại `/health`

---

## 🚀 Hướng Dẫn Chạy Bằng Docker (Khuyến nghị)

### Yêu cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã cài đặt và đang chạy
- [Git](https://git-scm.com/)

### Các bước

```bash
# 1. Clone dự án
git clone <repository-url>
cd webnangcao

# 2. Tạo file .env từ template
cp .env.example .env

# 3. Build và khởi động tất cả services
docker-compose up --build

# Hoặc chạy ở background (detached mode)
docker-compose up --build -d
```

### Truy cập
| Service | URL |
|---------|-----|
| 🌐 Frontend (React) | http://localhost:3000 |
| ⚙️ Backend API (NestJS) | http://localhost:8080 |
| 📚 Swagger Docs | http://localhost:8080/docs |

### Dừng ứng dụng
```bash
docker-compose down

# Dừng và xóa cả volume (mất dữ liệu database)
docker-compose down -v
```

---

## 💻 Hướng Dẫn Chạy Local Development

### Yêu cầu
- Node.js >= 20.x
- npm >= 9.x

### Backend (NestJS)

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp ../.env.example .env
# Chỉnh sửa NODE_ENV=development

# Chạy ở chế độ development (hot-reload)
npm run start:dev

# Backend chạy tại: http://localhost:8080
```

### Frontend (React)

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Frontend chạy tại: http://localhost:3000
```

---

## 🔑 Tài Khoản Demo

| Tài khoản | Mật khẩu | Vai trò |
|-----------|----------|---------|
| `admin1111` | `admin123` | 👑 Admin |
| `chef_lan` | `user123` | 👨‍🍳 Chef |
| `user_demo` | `user123` | 👤 User |

> **Lưu ý:** Dữ liệu demo được seed tự động khi khởi động lần đầu.

---

## 📁 Cấu Trúc Thư Mục

```
webnangcao/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/               # Module xác thực JWT
│   │   ├── users/              # Module quản lý người dùng
│   │   ├── recipes/            # Module công thức nấu ăn
│   │   ├── categories/         # Module danh mục
│   │   ├── comments/           # Module bình luận
│   │   ├── ratings/            # Module đánh giá sao
│   │   ├── bookmarks/          # Module lưu công thức
│   │   ├── common/             # Guards, Decorators, DTOs dùng chung
│   │   ├── config/             # Cấu hình TypeORM, JWT
│   │   ├── seed/               # Dữ liệu mẫu
│   │   └── main.ts             # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # Components tái sử dụng
│   │   ├── pages/              # Các trang (Home, Recipe, Profile...)
│   │   ├── context/            # React Context (Auth, Theme)
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # Axios API services
│   │   ├── utils/              # Hàm tiện ích
│   │   └── App.jsx             # Root component
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf              # Cấu hình Nginx cho production
│   └── package.json
│
├── docker-compose.yml          # Orchestration toàn bộ services
├── .env.example                # Template biến môi trường
├── .gitignore
└── README.md
```

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| **NestJS** | ^10.x | Framework Node.js |
| **TypeORM** | ^0.3.x | ORM cho database |
| **SQLite** | 3 | Cơ sở dữ liệu |
| **Passport JWT** | ^4.x | Xác thực JSON Web Token |
| **class-validator** | ^0.14.x | Validation DTOs |
| **Swagger** | ^7.x | Tài liệu API tự động |
| **bcryptjs** | ^2.4.x | Mã hóa mật khẩu |
| **multer** | ^1.4.x | Upload file ảnh |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| **React** | ^18.x | UI Library |
| **React Router** | ^6.x | Client-side routing |
| **React Bootstrap** | ^2.x | UI Components |
| **Bootstrap** | ^5.x | CSS Framework |
| **Axios** | ^1.x | HTTP Client |
| **React Query** | ^5.x | Server state management |
| **React Hook Form** | ^7.x | Form management |

### Infrastructure
| Công nghệ | Mục đích |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Web server & Reverse proxy |
| **Node.js 20** | JavaScript runtime |

---

## 📡 API Documentation

Truy cập Swagger UI tại: **http://localhost:8080/docs**

Các nhóm API chính:
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `GET /recipes` - Lấy danh sách công thức
- `POST /recipes` - Tạo công thức mới
- `GET /recipes/:id` - Xem chi tiết công thức
- `GET /categories` - Lấy danh mục
- `GET /users/:id` - Xem hồ sơ người dùng

---

## 📜 Giấy Phép

Dự án này được phân phối dưới **Giấy phép MIT**.

```
MIT License

Copyright (c) 2026 Nguyễn Xuân Tú - MSV: 23010538

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

> 🍳 **Cookio** - *Nấu ăn ngon, chia sẻ yêu thương!*  
> Được xây dựng với ❤️ bởi Nguyễn Xuân Tú | Đại học Phenikaa 2026
