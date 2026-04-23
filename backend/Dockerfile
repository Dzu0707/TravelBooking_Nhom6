# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Tối ưu cache cho NuGet
COPY *.csproj ./
RUN dotnet restore

# Copy code và publish
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Runtime siêu nhẹ
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Cấu hình cổng và bảo mật
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER $APP_UID

# Chỉnh sửa: Thay "backend.dll" bằng tên project của bạn nếu khác
ENTRYPOINT ["dotnet", "backend.dll"]