# =============================================
# Stage 1: Builder - Build React application
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file package để tận dụng Docker layer cache
COPY package*.json ./

# Cài đặt tất cả dependencies
RUN npm ci

# Copy source code và public assets
COPY src ./src
COPY public ./public

# Biên dịch React thành static files
RUN npm run build

# =============================================
# Stage 2: Production - Phục vụ qua Nginx
# =============================================
FROM nginx:alpine

# Copy static files từ stage builder sang Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy cấu hình Nginx tùy chỉnh (hỗ trợ SPA routing + proxy API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80
