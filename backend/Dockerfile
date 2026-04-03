# Stage 1: Build chuyên nghiệp
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Tối ưu: Restore trước để tận dụng Docker Cache (giúp build máy sau nhanh hơn)
COPY *.csproj ./
RUN dotnet restore

# Sau đó mới copy toàn bộ code và build
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Runtime siêu nhẹ
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Cài đặt biến môi trường chạy trên cổng 8080 (Leader chọn 8080 là rất chuẩn)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# QUAN TRỌNG: Sửa tên từ TravelTour.API.dll thành backend.dll
ENTRYPOINT ["dotnet", "backend.dll"]