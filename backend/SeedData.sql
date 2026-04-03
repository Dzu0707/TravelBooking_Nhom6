USE [TravelTourDB]
GO

-- 1. NẠP ROLES (Nếu chưa có)
IF NOT EXISTS (SELECT * FROM Roles)
BEGIN
    INSERT [dbo].[Roles] ([Name]) VALUES (N'Admin'), (N'User')
END

-- 2. NẠP USERS (Mật khẩu theo chuỗi Hash Leader cung cấp)
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@travel.com')
BEGIN
    SET IDENTITY_INSERT [dbo].[Users] ON 
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [RoleId], [Phone], [IsLocked], [CreatedAt]) VALUES 
    (1, N'Huy Vũ Admin', N'admin@travel.com', N'$2a$11$.Kz31y/hwPrJYg8peRzt9uM2NLmjPaIuSdUAddvPfryEZYDRtwSUy', 1, N'0338083908', 0, GETDATE())
    SET IDENTITY_INSERT [dbo].[Users] OFF
END

-- 3. NẠP CATEGORIES (Danh mục Tour)
IF NOT EXISTS (SELECT * FROM Categories)
BEGIN
    SET IDENTITY_INSERT [dbo].[Categories] ON 
    INSERT [dbo].[Categories] ([Id], [Name], [Description]) VALUES 
    (1, N'Biển Đảo', N'Nghỉ dưỡng biển'), (2, N'Vùng Cao', N'Khám phá núi rừng'), (3, N'Di Sản', N'Văn hóa')
    SET IDENTITY_INSERT [dbo].[Categories] OFF
END

-- 4. NẠP TOURS (Sản phẩm mẫu)
IF NOT EXISTS (SELECT * FROM Tours)
BEGIN
    SET IDENTITY_INSERT [dbo].[Tours] ON 
    INSERT [dbo].[Tours] ([Id], [Name], [Code], [Description], [DepartureLocation], [CategoryId], [CreatedAt]) VALUES 
    (1, N'Hạ Long Bay', N'HL01', N'Vịnh Hạ Long', N'Hà Nội', 1, GETDATE()),
    (2, N'Sapa Fansipan', N'SP02', N'Đỉnh Fansipan', N'Hà Nội', 2, GETDATE())
    SET IDENTITY_INSERT [dbo].[Tours] OFF
END

-- 5. NẠP LỊCH TRÌNH (TourSchedules)
IF NOT EXISTS (SELECT * FROM TourSchedules)
BEGIN
    SET IDENTITY_INSERT [dbo].[TourSchedules] ON 
    INSERT [dbo].[TourSchedules] ([Id], [TourId], [DepartureDate], [ReturnDate], [AdultPrice], [ChildPrice], [Quota], [AvailableSeats], [Status]) VALUES 
    (1,1,'2026-05-01','2026-05-03',3500000,2500000,30,30,N'Available'),
    (2,2,'2026-05-15','2026-05-18',4200000,3200000,20,20,N'Available')
    SET IDENTITY_INSERT [dbo].[TourSchedules] OFF
END

PRINT '--- DA NAP DU LIEU MAU THANH CONG ---';