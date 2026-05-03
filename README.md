TravelBooking - Nhóm

Chào mừng bạn đến với dự án Hệ thống Đặt Tour Du lịch. Đây là hướng dẫn chi tiết
dành cho người mới bắt đầu để thiết lập và chạy dự án sử dụng Docker một cách
nhanh nhất.

1. Kiến Trúc Dự Án
Frontend: React + TypeScript + Vite (Port 5173)
Backend: ASP.NET Core Web API (.NET 8) (Port 5000)
Database: SQL Server 2022 (Port 1433)

2. Chuẩn bị công cụ
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

Git Tải mã nguồn (Clone) dự án về máy. git-scm.com
Docker Desktop

Nền tảng chính để chạy Container mà không
cần cài .NET hay SQL Server rời. docker.com

Kiểm tra nhanh: Mở Terminal (cmd hoặc PowerShell) và gõ các lệnh sau để đảm
bảo mọi thứ đã sẵn sàng:
git --version
docker --version
docker compose version

3. Các bước triển khai (Dùng Docker)
Bước 1: Tải mã nguồn
Mở thư mục bạn muốn lưu dự án, chuột phải chọn "Open in Terminal" và chạy:

git clone https://github.com/Dzu0707/TravelBooking_Nhom6.git
cd TravelBooking_Nhom4

Bước 2: Khởi chạy toàn bộ hệ thống
Docker Compose sẽ tự động đọc file docker-compose.yml để tải Database và
build source code của bạn:

docker compose up -d --build
-d : Chạy ở chế độ nền (Detached mode), bạn có thể đóng terminal mà app vẫn
chạy.
--build : Ép Docker xây dựng lại ảnh (image) từ code mới nhất.
Bước 3: Kiểm tra kết quả
Sau khi lệnh trên hoàn tất, hãy kiểm tra danh sách các "thùng chứa" đang chạy:

docker compose ps

Nếu cột STATUS hiện là Up hoặc Running , chúc mừng bạn đã thành công!

4. Truy cập ứng dụng
Bạn có thể mở trình duyệt và truy cập các đường dẫn sau:
Giao diện người dùng: http://localhost:5173
Trang quản lý API (Swagger): http://localhost:5000/swagger
Kết nối Database: Server: localhost,1433 (User: sa )

5. Các lệnh xử lý sự cố nhanh
Khi muốn dừng hẳn: docker compose down
•

•

•
•
•

•

Khi muốn xem lỗi Backend: docker compose logs backend
Khi muốn reset trắng Database: docker compose down -v
Lưu ý: Khi bạn sửa code trong VS Code, hãy chạy lại lệnh ở Bước 2 để Docker cập
nhật những thay đổi đó vào ứng dụng đang chạy.
