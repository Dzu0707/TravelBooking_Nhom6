# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Tối ưu cache cho NPM
COPY package*.json ./
RUN npm install

# Build ứng dụng
COPY . .
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:stable-alpine
# Xóa file mặc định
RUN rm -rf /usr/share/nginx/html/*
# Copy file build (Vite dùng 'dist', CRA dùng 'build')
COPY --from=build /app/dist /usr/share/nginx/html
# Copy cấu hình Nginx của bạn
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]