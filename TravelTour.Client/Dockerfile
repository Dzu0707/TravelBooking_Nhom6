FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Dùng Nginx để phục vụ file tĩnh
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# File cấu hình nginx (nếu có) để xử lý React Router
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]