# =============================================
# Stage 1: Builder - Biên dịch TypeScript
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file package để tận dụng Docker layer cache
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies)
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Biên dịch TypeScript sang JavaScript
RUN npm run build

# =============================================
# Stage 2: Production - Chạy ứng dụng
# =============================================
FROM node:20-alpine

WORKDIR /app

# Tạo thư mục lưu database SQLite
RUN mkdir -p /app/data

# Copy file package để cài production dependencies
COPY package*.json ./

# Chỉ cài production dependencies (nhẹ hơn)
RUN npm ci --only=production

# Copy build output từ stage builder
COPY --from=builder /app/dist ./dist

# Copy node_modules từ builder (đã có đủ production deps)
COPY --from=builder /app/node_modules ./node_modules

# Mở cổng 8080 cho NestJS
EXPOSE 8080

# Khởi động ứng dụng
CMD ["node", "dist/main"]
