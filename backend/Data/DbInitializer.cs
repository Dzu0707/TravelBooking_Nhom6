using Microsoft.EntityFrameworkCore;
using TravelTour.API.Models;

namespace TravelTour.API.Data;

public static class DbInitializer
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        var fixedDate = new DateTime(2026, 04, 20);

        // 1. Roles
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "User" }
        );

        // 2. Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Tour Biển", Description = "Đắm mình trong làn nước trong xanh..." },
            new Category { Id = 2, Name = "Tour Di Sản - Văn Hóa", Description = "Hành trình ngược dòng thời gian..." },
            new Category { Id = 3, Name = "Tour Khám Phá", Description = "Dành cho những tâm hồn đam mê xê dịch..." },
            new Category { Id = 4, Name = "Tour Miền Tây", Description = "Trải nghiệm nhịp sống bình dị..." },
            new Category { Id = 5, Name = "Tour Núi", Description = "Chinh phục những đỉnh cao mây mờ..." }
        );

        // 3. Users
        var passwordHash = "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW";
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Nguyễn Văn A", Email = "a@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000001", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 2, FullName = "Trần Thị B", Email = "b@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000002", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 3, FullName = "Lê Văn C", Email = "c@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000003", IsLocked = true, CreatedAt = fixedDate },
            new User { Id = 4, FullName = "Phạm Thị D", Email = "d@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000004", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 5, FullName = "Hoàng Văn E", Email = "e@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000005", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 6, FullName = "Đỗ Thị F", Email = "f@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000006", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 7, FullName = "Võ Văn G", Email = "g@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000007", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 8, FullName = "Bùi Thị H", Email = "h@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000008", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 9, FullName = "Ngô Văn I", Email = "i@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "090000009", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 10, FullName = "Admin", Email = "admin@travel.com", PasswordHash = passwordHash, RoleId = 1, Phone = "0999999999", IsLocked = false, CreatedAt = fixedDate }
        );

        // 4. Tours
        modelBuilder.Entity<Tour>().HasData(
            new Tour
            {
                Id = 1,
                Name = "Tour Côn Đảo",
                Code = "CD001",
                Description = "Thiên đường biển hoang sơ",
                DepartureLocation = "TP.HCM",
                MinPrice = 4500000,
                CategoryId = 1,
                CreatedAt = fixedDate
            },
            new Tour
            {
                Id = 2,
                Name = "Tour Đảo Phú Quý",
                Code = "PQ002",
                Description = "Trải nghiệm biển đảo yên bình",
                DepartureLocation = "TP.HCM",
                MinPrice = 3000000,
                CategoryId = 3,
                CreatedAt = fixedDate
            },
            new Tour
            {
                Id = 3,
                Name = "Tour Nha Trang",
                Code = "NT003",
                Description = "Biển xanh & vui chơi giải trí",
                DepartureLocation = "Hà Nội",
                MinPrice = 5200000,
                CategoryId = 3,
                CreatedAt = fixedDate
            },
            new Tour
            {
                Id = 4,
                Name = "Tour Phú Quốc",
                Code = "PQ004",
                Description = "Đảo ngọc nghỉ dưỡng cao cấp",
                DepartureLocation = "TP.HCM",
                MinPrice = 3800000,
                CategoryId = 2,
                CreatedAt = fixedDate
            }
        );

        // 5. MediaAssets
        modelBuilder.Entity<MediaAsset>().HasData(
            new MediaAsset { Id = 1, FileName = "ConDao.webp", FileUrl = "/uploads/media/ConDao.webp", AltText = "Côn Đảo", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 2, FileName = "ConDao1.webp", FileUrl = "/uploads/media/ConDao1.webp", AltText = "Côn Đảo 1", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 3, FileName = "ConDao2.webp", FileUrl = "/uploads/media/ConDao2.webp", AltText = "Côn Đảo 2", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 4, FileName = "DaoPhuQuy.webp", FileUrl = "/uploads/media/DaoPhuQuy.webp", AltText = "Đảo Phú Quý", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 5, FileName = "DaoPhuQuy1.webp", FileUrl = "/uploads/media/DaoPhuQuy1.webp", AltText = "Đảo Phú Quý 1", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 6, FileName = "DaoPhuQuy2.webp", FileUrl = "/uploads/media/DaoPhuQuy2.webp", AltText = "Đảo Phú Quý 2", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 7, FileName = "NhaTrang.webp", FileUrl = "/uploads/media/NhaTrang.webp", AltText = "Nha Trang", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 8, FileName = "NhaTrang1.webp", FileUrl = "/uploads/media/NhaTrang1.webp", AltText = "Nha Trang 1", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 9, FileName = "NhaTrang2.webp", FileUrl = "/uploads/media/NhaTrang2.webp", AltText = "Nha Trang 2", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 10, FileName = "PhuQuoc.webp", FileUrl = "/uploads/media/PhuQuoc.webp", AltText = "Phú Quốc", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 11, FileName = "PhuQuoc1.webp", FileUrl = "/uploads/media/PhuQuoc1.webp", AltText = "Phú Quốc 1", UploadedById = 10, CreatedAt = fixedDate },
            new MediaAsset { Id = 12, FileName = "PhuQuoc2.webp", FileUrl = "/uploads/media/PhuQuoc2.webp", AltText = "Phú Quốc 2", UploadedById = 10, CreatedAt = fixedDate }
        );

        // 6. TourImages
        modelBuilder.Entity<TourImage>().HasData(
            new TourImage { Id = 1, TourId = 1, MediaAssetId = 1, IsPrimary = true, SortOrder = 1 },
            new TourImage { Id = 2, TourId = 1, MediaAssetId = 2, IsPrimary = false, SortOrder = 2 },
            new TourImage { Id = 3, TourId = 1, MediaAssetId = 3, IsPrimary = false, SortOrder = 3 },

            new TourImage { Id = 4, TourId = 2, MediaAssetId = 4, IsPrimary = true, SortOrder = 1 },
            new TourImage { Id = 5, TourId = 2, MediaAssetId = 5, IsPrimary = false, SortOrder = 2 },
            new TourImage { Id = 6, TourId = 2, MediaAssetId = 6, IsPrimary = false, SortOrder = 3 },

            new TourImage { Id = 7, TourId = 3, MediaAssetId = 7, IsPrimary = true, SortOrder = 1 },
            new TourImage { Id = 8, TourId = 3, MediaAssetId = 8, IsPrimary = false, SortOrder = 2 },
            new TourImage { Id = 9, TourId = 3, MediaAssetId = 9, IsPrimary = false, SortOrder = 3 },

            new TourImage { Id = 10, TourId = 4, MediaAssetId = 10, IsPrimary = true, SortOrder = 1 },
            new TourImage { Id = 11, TourId = 4, MediaAssetId = 11, IsPrimary = false, SortOrder = 2 },
            new TourImage { Id = 12, TourId = 4, MediaAssetId = 12, IsPrimary = false, SortOrder = 3 }
        );

        // 7. TourSchedules
        modelBuilder.Entity<TourSchedule>().HasData(
            new TourSchedule { Id = 1, TourId = 1, DepartureDate = fixedDate.AddDays(5), ReturnDate = fixedDate.AddDays(8), AdultPrice = 4500000, ChildPrice = 3000000, Quota = 20, AvailableSeats = 10, Status = "Available" },
            new TourSchedule { Id = 2, TourId = 2, DepartureDate = fixedDate.AddDays(6), ReturnDate = fixedDate.AddDays(9), AdultPrice = 3000000, ChildPrice = 2000000, Quota = 20, AvailableSeats = 0, Status = "Full" },
            new TourSchedule { Id = 3, TourId = 3, DepartureDate = fixedDate.AddDays(7), ReturnDate = fixedDate.AddDays(10), AdultPrice = 5200000, ChildPrice = 3500000, Quota = 20, AvailableSeats = 5, Status = "Available" },
            new TourSchedule { Id = 4, TourId = 4, DepartureDate = fixedDate.AddDays(8), ReturnDate = fixedDate.AddDays(11), AdultPrice = 3800000, ChildPrice = 2500000, Quota = 20, AvailableSeats = 0, Status = "Cancelled" },
            new TourSchedule { Id = 5, TourId = 1, DepartureDate = fixedDate.AddDays(9), ReturnDate = fixedDate.AddDays(12), AdultPrice = 900000, ChildPrice = 600000, Quota = 20, AvailableSeats = 8, Status = "Available" },
            new TourSchedule { Id = 6, TourId = 2, DepartureDate = fixedDate.AddDays(10), ReturnDate = fixedDate.AddDays(13), AdultPrice = 4700000, ChildPrice = 3000000, Quota = 20, AvailableSeats = 0, Status = "Full" },
            new TourSchedule { Id = 7, TourId = 3, DepartureDate = fixedDate.AddDays(11), ReturnDate = fixedDate.AddDays(14), AdultPrice = 3200000, ChildPrice = 2000000, Quota = 20, AvailableSeats = 12, Status = "Available" },
            new TourSchedule { Id = 8, TourId = 4, DepartureDate = fixedDate.AddDays(12), ReturnDate = fixedDate.AddDays(15), AdultPrice = 3100000, ChildPrice = 2000000, Quota = 20, AvailableSeats = 0, Status = "Cancelled" },
            new TourSchedule { Id = 9, TourId = 1, DepartureDate = fixedDate.AddDays(13), ReturnDate = fixedDate.AddDays(16), AdultPrice = 5500000, ChildPrice = 3500000, Quota = 20, AvailableSeats = 7, Status = "Available" },
            new TourSchedule { Id = 10, TourId = 2, DepartureDate = fixedDate.AddDays(14), ReturnDate = fixedDate.AddDays(15), AdultPrice = 700000, ChildPrice = 500000, Quota = 20, AvailableSeats = 3, Status = "Available" }
        );

        // 8. Bookings
        modelBuilder.Entity<Booking>().HasData(
            new Booking { Id = 1, UserId = 1, TourScheduleId = 1, TotalPassengers = 2, TotalPrice = 9000000, Status = "Confirmed", CreatedAt = fixedDate },
            new Booking { Id = 2, UserId = 2, TourScheduleId = 2, TotalPassengers = 2, TotalPrice = 6000000, Status = "Pending", CreatedAt = fixedDate },
            new Booking { Id = 3, UserId = 3, TourScheduleId = 3, TotalPassengers = 2, TotalPrice = 10400000, Status = "Cancelled", CreatedAt = fixedDate },
            new Booking { Id = 4, UserId = 4, TourScheduleId = 4, TotalPassengers = 2, TotalPrice = 7600000, Status = "Cancelled", CreatedAt = fixedDate },
            new Booking { Id = 5, UserId = 5, TourScheduleId = 5, TotalPassengers = 3, TotalPrice = 2700000, Status = "Confirmed", CreatedAt = fixedDate },
            new Booking { Id = 6, UserId = 6, TourScheduleId = 6, TotalPassengers = 2, TotalPrice = 9400000, Status = "Pending", CreatedAt = fixedDate },
            new Booking { Id = 7, UserId = 7, TourScheduleId = 7, TotalPassengers = 2, TotalPrice = 6400000, Status = "Confirmed", CreatedAt = fixedDate },
            new Booking { Id = 8, UserId = 8, TourScheduleId = 8, TotalPassengers = 1, TotalPrice = 3100000, Status = "Cancelled", CreatedAt = fixedDate },
            new Booking { Id = 9, UserId = 9, TourScheduleId = 9, TotalPassengers = 2, TotalPrice = 11000000, Status = "Confirmed", CreatedAt = fixedDate },
            new Booking { Id = 10, UserId = 1, TourScheduleId = 10, TotalPassengers = 2, TotalPrice = 1400000, Status = "Pending", CreatedAt = fixedDate }
        );

        // 9. Transactions
        modelBuilder.Entity<Transaction>().HasData(
            new Transaction { Id = 1, BookingId = 1, TransactionCode = "TRANS001", Amount = 9000000, PaymentMethod = "VNPay", Status = "Success", CreatedAt = fixedDate },
            new Transaction { Id = 2, BookingId = 2, TransactionCode = "TRANS002", Amount = 6000000, PaymentMethod = "Momo", Status = "Pending", CreatedAt = fixedDate },
            new Transaction { Id = 3, BookingId = 3, TransactionCode = "TRANS003", Amount = 10400000, PaymentMethod = "VNPay", Status = "Failed", CreatedAt = fixedDate },
            new Transaction { Id = 4, BookingId = 4, TransactionCode = "TRANS004", Amount = 7600000, PaymentMethod = "VNPay", Status = "Failed", CreatedAt = fixedDate },
            new Transaction { Id = 5, BookingId = 5, TransactionCode = "TRANS005", Amount = 2700000, PaymentMethod = "Momo", Status = "Success", CreatedAt = fixedDate },
            new Transaction { Id = 6, BookingId = 6, TransactionCode = "TRANS006", Amount = 9400000, PaymentMethod = "VNPay", Status = "Pending", CreatedAt = fixedDate },
            new Transaction { Id = 7, BookingId = 7, TransactionCode = "TRANS007", Amount = 6400000, PaymentMethod = "Momo", Status = "Success", CreatedAt = fixedDate },
            new Transaction { Id = 8, BookingId = 8, TransactionCode = "TRANS008", Amount = 3100000, PaymentMethod = "VNPay", Status = "Failed", CreatedAt = fixedDate },
            new Transaction { Id = 9, BookingId = 9, TransactionCode = "TRANS009", Amount = 11000000, PaymentMethod = "VNPay", Status = "Success", CreatedAt = fixedDate },
            new Transaction { Id = 10, BookingId = 10, TransactionCode = "TRANS010", Amount = 1400000, PaymentMethod = "Momo", Status = "Pending", CreatedAt = fixedDate }
        );

        // 10. Vouchers
        modelBuilder.Entity<Voucher>().HasData(
            new Voucher { Id = 1, Code = "SUMMER10", DiscountType = "Percentage", DiscountValue = 10, Quantity = 50, ExpiryDate = fixedDate.AddMonths(3) },
            new Voucher { Id = 2, Code = "SALE200K", DiscountType = "FixedAmount", DiscountValue = 200000, Quantity = 30, ExpiryDate = fixedDate.AddMonths(2) },
            new Voucher { Id = 3, Code = "NEWUSER", DiscountType = "Percentage", DiscountValue = 15, Quantity = 100, ExpiryDate = fixedDate.AddMonths(6) },
            new Voucher { Id = 4, Code = "VIP500K", DiscountType = "FixedAmount", DiscountValue = 500000, Quantity = 10, ExpiryDate = fixedDate.AddMonths(1) },
            new Voucher { Id = 5, Code = "HOLIDAY", DiscountType = "Percentage", DiscountValue = 20, Quantity = 20, ExpiryDate = fixedDate.AddMonths(4) },
            new Voucher { Id = 6, Code = "FLASH", DiscountType = "FixedAmount", DiscountValue = 100000, Quantity = 40, ExpiryDate = fixedDate.AddDays(15) },
            new Voucher { Id = 7, Code = "WEEKEND", DiscountType = "Percentage", DiscountValue = 5, Quantity = 60, ExpiryDate = fixedDate.AddMonths(2) },
            new Voucher { Id = 8, Code = "TRAVEL50", DiscountType = "FixedAmount", DiscountValue = 50000, Quantity = 80, ExpiryDate = fixedDate.AddMonths(3) },
            new Voucher { Id = 9, Code = "FAMILY", DiscountType = "Percentage", DiscountValue = 12, Quantity = 25, ExpiryDate = fixedDate.AddMonths(5) },
            new Voucher { Id = 10, Code = "LASTMIN", DiscountType = "Percentage", DiscountValue = 8, Quantity = 15, ExpiryDate = fixedDate.AddDays(10) }
        );

        // 11. Reviews
        modelBuilder.Entity<Review>().HasData(
            new Review { Id = 1, UserId = 1, TourId = 1, Rating = 5, Comment = "Tour rất tuyệt!", CreatedAt = fixedDate },
            new Review { Id = 2, UserId = 2, TourId = 2, Rating = 4, Comment = "Khá ổn", CreatedAt = fixedDate },
            new Review { Id = 3, UserId = 3, TourId = 3, Rating = 3, Comment = "Bình thường", CreatedAt = fixedDate },
            new Review { Id = 4, UserId = 4, TourId = 4, Rating = 5, Comment = "Rất đáng tiền", CreatedAt = fixedDate },
            new Review { Id = 5, UserId = 5, TourId = 1, Rating = 2, Comment = "Không như mong đợi", CreatedAt = fixedDate },
            new Review { Id = 6, UserId = 6, TourId = 2, Rating = 4, Comment = "Dịch vụ tốt", CreatedAt = fixedDate },
            new Review { Id = 7, UserId = 7, TourId = 3, Rating = 5, Comment = "Cảnh đẹp", CreatedAt = fixedDate },
            new Review { Id = 8, UserId = 8, TourId = 4, Rating = 3, Comment = "Tạm được", CreatedAt = fixedDate },
            new Review { Id = 9, UserId = 9, TourId = 1, Rating = 4, Comment = "Hài lòng", CreatedAt = fixedDate },
            new Review { Id = 10, UserId = 1, TourId = 2, Rating = 5, Comment = "Rất thích", CreatedAt = fixedDate }
        );

        // 12. BookingAttendees
        modelBuilder.Entity<BookingAttendee>().HasData(
            new BookingAttendee { Id = 1, BookingId = 1, FullName = "Nguyễn Văn A", DateOfBirth = new DateTime(2000, 1, 1), Type = "Adult" },
            new BookingAttendee { Id = 2, BookingId = 2, FullName = "Trần Thị B", DateOfBirth = new DateTime(2001, 2, 2), Type = "Adult" },
            new BookingAttendee { Id = 3, BookingId = 3, FullName = "Lê Văn C", DateOfBirth = new DateTime(2002, 3, 3), Type = "Adult" },
            new BookingAttendee { Id = 4, BookingId = 4, FullName = "Phạm Thị D", DateOfBirth = new DateTime(2003, 4, 4), Type = "Adult" },
            new BookingAttendee { Id = 5, BookingId = 5, FullName = "Hoàng Văn E", DateOfBirth = new DateTime(2004, 5, 5), Type = "Adult" },
            new BookingAttendee { Id = 6, BookingId = 6, FullName = "Đỗ Thị F", DateOfBirth = new DateTime(2005, 6, 6), Type = "Adult" },
            new BookingAttendee { Id = 7, BookingId = 7, FullName = "Võ Văn G", DateOfBirth = new DateTime(2000, 7, 7), Type = "Adult" },
            new BookingAttendee { Id = 8, BookingId = 8, FullName = "Bùi Thị H", DateOfBirth = new DateTime(2001, 8, 8), Type = "Child" },
            new BookingAttendee { Id = 9, BookingId = 9, FullName = "Ngô Văn I", DateOfBirth = new DateTime(2002, 9, 9), Type = "Adult" },
            new BookingAttendee { Id = 10, BookingId = 10, FullName = "Admin", DateOfBirth = new DateTime(1995, 1, 1), Type = "Adult" }
        );

        // 13. NewsCategories
        modelBuilder.Entity<NewsCategory>().HasData(
            new NewsCategory { Id = 1, Name = "Tin du lịch", Slug = "tin-du-lich", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 2, Name = "Khuyến mãi", Slug = "khuyen-mai", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 3, Name = "Kinh nghiệm", Slug = "kinh-nghiem", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 4, Name = "Ẩm thực", Slug = "am-thuc", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 5, Name = "Check-in", Slug = "check-in", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 6, Name = "Review", Slug = "review", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 7, Name = "Tips", Slug = "tips", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 8, Name = "Tin hot", Slug = "tin-hot", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 9, Name = "Du lịch quốc tế", Slug = "du-lich-qt", IsActive = true, CreatedAt = fixedDate },
            new NewsCategory { Id = 10, Name = "Blog", Slug = "blog", IsActive = true, CreatedAt = fixedDate }
        );

        // 14. NewsTags
        modelBuilder.Entity<NewsTag>().HasData(
            new NewsTag { Id = 1, Name = "Du lịch biển", Slug = "du-lich-bien", CreatedAt = fixedDate },
            new NewsTag { Id = 2, Name = "Du lịch núi", Slug = "du-lich-nui", CreatedAt = fixedDate },
            new NewsTag { Id = 3, Name = "Ẩm thực", Slug = "am-thuc", CreatedAt = fixedDate },
            new NewsTag { Id = 4, Name = "Kinh nghiệm", Slug = "kinh-nghiem", CreatedAt = fixedDate },
            new NewsTag { Id = 5, Name = "Check-in đẹp", Slug = "check-in-dep", CreatedAt = fixedDate },
            new NewsTag { Id = 6, Name = "Review tour", Slug = "review-tour", CreatedAt = fixedDate },
            new NewsTag { Id = 7, Name = "Phượt", Slug = "phuot", CreatedAt = fixedDate },
            new NewsTag { Id = 8, Name = "Resort", Slug = "resort", CreatedAt = fixedDate },
            new NewsTag { Id = 9, Name = "Gia đình", Slug = "gia-dinh", CreatedAt = fixedDate },
            new NewsTag { Id = 10, Name = "Khuyến mãi", Slug = "khuyen-mai", CreatedAt = fixedDate }
        );

        // 15. NewsPosts
        modelBuilder.Entity<NewsPost>().HasData(
            new NewsPost { Id = 1, Title = "Top 5 bãi biển đẹp nhất Phú Quốc", Slug = "bien-dep-phu-quoc", Summary = "Danh sách bãi biển đẹp", Content = "Phú Quốc nổi tiếng với bãi Sao...", CategoryId = 1, AuthorId = 1, Status = "Published", IsFeatured = true, ViewCount = 120, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 2, Title = "Kinh nghiệm đi Đà Lạt tự túc", Slug = "kinh-nghiem-da-lat", Summary = "Hướng dẫn du lịch Đà Lạt", Content = "Đà Lạt là điểm đến lý tưởng...", CategoryId = 3, AuthorId = 2, Status = "Published", IsFeatured = false, ViewCount = 90, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 3, Title = "Ăn gì ở Nha Trang?", Slug = "am-thuc-nha-trang", Summary = "Top món ngon Nha Trang", Content = "Hải sản Nha Trang rất nổi tiếng...", CategoryId = 4, AuthorId = 3, Status = "Published", IsFeatured = true, ViewCount = 150, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 4, Title = "Check-in Sapa mùa tuyết", Slug = "checkin-sapa", Summary = "Sapa mùa đông cực đẹp", Content = "Nếu may mắn bạn sẽ thấy tuyết...", CategoryId = 5, AuthorId = 4, Status = "Draft", IsFeatured = false, ViewCount = 30, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 5, Title = "Tour Đà Nẵng giá rẻ", Slug = "tour-da-nang-gia-re", Summary = "Combo tiết kiệm", Content = "Du lịch Đà Nẵng chưa bao giờ rẻ...", CategoryId = 2, AuthorId = 5, Status = "Published", IsFeatured = true, ViewCount = 200, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 6, Title = "Phượt Hà Giang cần chuẩn bị gì?", Slug = "phuot-ha-giang", Summary = "Checklist phượt", Content = "Hà Giang là cung đường mơ ước...", CategoryId = 7, AuthorId = 6, Status = "Published", IsFeatured = false, ViewCount = 80, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 7, Title = "Review resort Phú Yên", Slug = "review-resort-phu-yen", Summary = "Resort view biển", Content = "Phú Yên đang nổi lên...", CategoryId = 6, AuthorId = 7, Status = "Published", IsFeatured = false, ViewCount = 60, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 8, Title = "Du lịch gia đình nên đi đâu?", Slug = "du-lich-gia-dinh", Summary = "Gợi ý địa điểm", Content = "Các địa điểm phù hợp gia đình...", CategoryId = 9, AuthorId = 8, Status = "Published", IsFeatured = true, ViewCount = 140, ThumbnailUrl = "/uploads/media/ConDao1.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 9, Title = "Combo Côn Đảo tiết kiệm", Slug = "combo-con-dao", Summary = "Ưu đãi hot", Content = "Côn Đảo là điểm đến tâm linh...", CategoryId = 2, AuthorId = 9, Status = "Draft", IsFeatured = false, ViewCount = 20, ThumbnailUrl = "/uploads/media/ConDao1.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate },
            new NewsPost { Id = 10, Title = "Khám phá Sài Gòn 1 ngày", Slug = "sai-gon-1-ngay", Summary = "City tour HCM", Content = "Bạn có thể đi Nhà thờ Đức Bà...", CategoryId = 10, AuthorId = 1, Status = "Published", IsFeatured = true, ViewCount = 300, ThumbnailUrl = "/uploads/media/ConDao2.webp", CreatedAt = fixedDate, UpdatedAt = fixedDate }
        );

        // 16. NewsTagMaps
        modelBuilder.Entity<NewsTagMap>().HasData(
            new NewsTagMap { NewsPostId = 1, NewsTagId = 1 },
            new NewsTagMap { NewsPostId = 2, NewsTagId = 4 },
            new NewsTagMap { NewsPostId = 3, NewsTagId = 3 },
            new NewsTagMap { NewsPostId = 4, NewsTagId = 5 },
            new NewsTagMap { NewsPostId = 5, NewsTagId = 10 },
            new NewsTagMap { NewsPostId = 6, NewsTagId = 7 },
            new NewsTagMap { NewsPostId = 7, NewsTagId = 8 },
            new NewsTagMap { NewsPostId = 8, NewsTagId = 9 },
            new NewsTagMap { NewsPostId = 9, NewsTagId = 10 },
            new NewsTagMap { NewsPostId = 10, NewsTagId = 5 }
        );
    }
}
