using Microsoft.EntityFrameworkCore;
using TravelTour.API.Models;
using System.Collections.Generic;
using System.Linq;

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
            new Category { Id = 1, Name = "Tour Biển - Đảo", Description = "Các tour biển, đảo và nghỉ dưỡng ven biển." },
            new Category { Id = 2, Name = "Tour Núi - Cao nguyên", Description = "Khám phá núi rừng, cao nguyên và khí hậu mát mẻ." },
            new Category { Id = 3, Name = "Tour Di sản - Văn hóa", Description = "Hành trình di sản, lịch sử và văn hóa bản địa." },
            new Category { Id = 4, Name = "Tour Miền Tây - Sông nước", Description = "Trải nghiệm miền Tây, chợ nổi và văn hóa sông nước." },
            new Category { Id = 5, Name = "Tour Thiên nhiên - Khám phá", Description = "Hang động, cảnh quan tự nhiên và điểm đến độc đáo." }
        );

        // 3. Users (10 rows)
        var passwordHash = "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW";
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Nguyễn Minh Anh", Email = "minhanh.nguyen@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0903123456", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 2, FullName = "Trần Thu Hằng", Email = "thuhang.tran@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0912233445", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 3, FullName = "Lê Quốc Cường", Email = "quoccuong.le@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0987654321", IsLocked = true, CreatedAt = fixedDate },
            new User { Id = 4, FullName = "Phạm Ngọc Diễm", Email = "ngocdiem.pham@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0938345678", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 5, FullName = "Hoàng Gia Bảo", Email = "giabao.hoang@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0977123456", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 6, FullName = "Đỗ Khánh Linh", Email = "khanhlinh.do@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0909988776", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 7, FullName = "Võ Thành Nam", Email = "thanhnam.vo@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0945566778", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 8, FullName = "Bùi Hải Yến", Email = "haiyen.bui@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0923123123", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 9, FullName = "Ngô Đức Long", Email = "duclong.ngo@gmail.com", PasswordHash = passwordHash, RoleId = 2, Phone = "0968877665", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 10, FullName = "Admin", Email = "admin@travel.com", PasswordHash = passwordHash, RoleId = 1, Phone = "0999999999", IsLocked = false, CreatedAt = fixedDate }
        );

        // 4. Tours (21 rows)
        modelBuilder.Entity<Tour>().HasData(
            new Tour { Id = 1, Name = "Tour Côn Đảo", Code = "TOUR001", Description = "Biển xanh hoang sơ và di tích lịch sử Côn Đảo.", DepartureLocation = "TP.HCM", MinPrice = 4200000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 2, Name = "Tour Phú Quốc", Code = "TOUR002", Description = "Nghỉ dưỡng đảo ngọc với bãi biển trong xanh.", DepartureLocation = "TP.HCM", MinPrice = 3900000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 3, Name = "Tour Nha Trang", Code = "TOUR003", Description = "Khám phá thành phố biển sôi động.", DepartureLocation = "Hà Nội", MinPrice = 3600000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 4, Name = "Tour Phú Yên", Code = "TOUR004", Description = "Gành Đá Đĩa và vẻ đẹp bình yên xứ Nẫu.", DepartureLocation = "TP.HCM", MinPrice = 3200000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 5, Name = "Tour Vịnh Hạ Long", Code = "TOUR005", Description = "Du thuyền và kỳ quan thiên nhiên thế giới.", DepartureLocation = "Hà Nội", MinPrice = 4100000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 6, Name = "Tour Đà Nẵng", Code = "TOUR006", Description = "Biển Mỹ Khê, Bà Nà và thành phố đáng sống.", DepartureLocation = "Hà Nội", MinPrice = 3700000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 7, Name = "Tour Quy Nhơn", Code = "TOUR007", Description = "Kỳ Co - Eo Gió và biển xanh trong.", DepartureLocation = "TP.HCM", MinPrice = 3400000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 8, Name = "Tour Ninh Thuận", Code = "TOUR008", Description = "Vịnh Vĩnh Hy, nho Ninh Thuận.", DepartureLocation = "TP.HCM", MinPrice = 3300000, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 9, Name = "Tour Phan Thiết", Code = "TOUR009", Description = "Mũi Né, đồi cát và resort biển.", DepartureLocation = "TP.HCM", MinPrice = 2800000, CategoryId = 1, CreatedAt = fixedDate },

            new Tour { Id = 10, Name = "Tour Đà Lạt", Code = "TOUR010", Description = "Thành phố ngàn hoa mộng mơ.", DepartureLocation = "TP.HCM", MinPrice = 2900000, CategoryId = 2, CreatedAt = fixedDate },
            new Tour { Id = 11, Name = "Tour Mộc Châu", Code = "TOUR011", Description = "Đồi chè, mùa hoa và bản làng.", DepartureLocation = "Hà Nội", MinPrice = 3100000, CategoryId = 2, CreatedAt = fixedDate },
            new Tour { Id = 12, Name = "Tour Sa Pa", Code = "TOUR012", Description = "Fansipan, bản Cát Cát và mây núi.", DepartureLocation = "Hà Nội", MinPrice = 3500000, CategoryId = 2, CreatedAt = fixedDate },
            new Tour { Id = 13, Name = "Tour Hà Giang", Code = "TOUR013", Description = "Cao nguyên đá và cung đường đèo hùng vĩ.", DepartureLocation = "Hà Nội", MinPrice = 3800000, CategoryId = 2, CreatedAt = fixedDate },
            new Tour { Id = 14, Name = "Tour Buôn Ma Thuột", Code = "TOUR014", Description = "Thủ phủ cà phê và văn hóa Tây Nguyên.", DepartureLocation = "TP.HCM", MinPrice = 3000000, CategoryId = 2, CreatedAt = fixedDate },
            new Tour { Id = 15, Name = "Tour Cao Bằng", Code = "TOUR015", Description = "Thác Bản Giốc và non nước biên cương.", DepartureLocation = "Hà Nội", MinPrice = 3600000, CategoryId = 2, CreatedAt = fixedDate },

            new Tour { Id = 16, Name = "Tour Huế", Code = "TOUR016", Description = "Cố đô Huế và quần thể di tích triều Nguyễn.", DepartureLocation = "Đà Nẵng", MinPrice = 2700000, CategoryId = 3, CreatedAt = fixedDate },
            new Tour { Id = 17, Name = "Tour Ninh Bình", Code = "TOUR017", Description = "Tràng An, Hoa Lư và Tam Cốc.", DepartureLocation = "Hà Nội", MinPrice = 2600000, CategoryId = 3, CreatedAt = fixedDate },

            new Tour { Id = 18, Name = "Tour Cần Thơ", Code = "TOUR018", Description = "Chợ nổi Cái Răng và miền sông nước.", DepartureLocation = "TP.HCM", MinPrice = 2400000, CategoryId = 4, CreatedAt = fixedDate },
            new Tour { Id = 19, Name = "Tour Tây Ninh", Code = "TOUR019", Description = "Núi Bà Đen và văn hóa tín ngưỡng.", DepartureLocation = "TP.HCM", MinPrice = 2200000, CategoryId = 4, CreatedAt = fixedDate },

            new Tour { Id = 20, Name = "Tour Đảo Phú Quý", Code = "TOUR020", Description = "Đảo tiền tiêu yên bình, nước biển trong.", DepartureLocation = "TP.HCM", MinPrice = 3400000, CategoryId = 5, CreatedAt = fixedDate },
            new Tour { Id = 21, Name = "Tour Quảng Bình", Code = "TOUR021", Description = "Phong Nha - Kẻ Bàng và động Thiên Đường.", DepartureLocation = "Đà Nẵng", MinPrice = 3600000, CategoryId = 5, CreatedAt = fixedDate }
        );

        // 5. MediaAssets (63 rows)
        var imageBases = new[]
        {
            "BuonMaThuot","CanTho","CaoBang","ConDao","DaLat","DaNang","DaoPhuQuy",
            "HaGiang","Hue","MocChau","NhaTrang","NinhBinh","NinhThuan","PhanThiet",
            "PhuQuoc","PhuYen","QuangBinh","QuyNhon","Sapa","TayNinh","VinhHaLongLong"
        };

        var mediaAssets = imageBases
            .SelectMany((name, idx) => new[]
            {
                new MediaAsset { Id = idx * 3 + 1, FileName = $"{name}.webp",  FileUrl = $"/uploads/media/{name}.webp",  AltText = name, UploadedById = 10, CreatedAt = fixedDate },
                new MediaAsset { Id = idx * 3 + 2, FileName = $"{name}1.webp", FileUrl = $"/uploads/media/{name}1.webp", AltText = $"{name} 1", UploadedById = 10, CreatedAt = fixedDate },
                new MediaAsset { Id = idx * 3 + 3, FileName = $"{name}2.webp", FileUrl = $"/uploads/media/{name}2.webp", AltText = $"{name} 2", UploadedById = 10, CreatedAt = fixedDate }
            })
            .ToArray();

        modelBuilder.Entity<MediaAsset>().HasData(mediaAssets);

        // 6. TourImages (63 rows)
        var tourImageBaseMap = new Dictionary<int, string>
        {
            { 1, "ConDao" }, { 2, "PhuQuoc" }, { 3, "NhaTrang" }, { 4, "PhuYen" }, { 5, "VinhHaLongLong" },
            { 6, "DaNang" }, { 7, "QuyNhon" }, { 8, "NinhThuan" }, { 9, "PhanThiet" }, { 10, "DaLat" },
            { 11, "MocChau" }, { 12, "Sapa" }, { 13, "HaGiang" }, { 14, "BuonMaThuot" }, { 15, "CaoBang" },
            { 16, "Hue" }, { 17, "NinhBinh" }, { 18, "CanTho" }, { 19, "TayNinh" }, { 20, "DaoPhuQuy" }, { 21, "QuangBinh" }
        };

        var mediaIdByFile = mediaAssets.ToDictionary(x => x.FileName, x => x.Id);

        var tourImages = new List<TourImage>();
        int tourImageId = 1;
        foreach (var kv in tourImageBaseMap)
        {
            var tourId = kv.Key;
            var b = kv.Value;

            tourImages.Add(new TourImage { Id = tourImageId++, TourId = tourId, MediaAssetId = mediaIdByFile[$"{b}.webp"], IsPrimary = true, SortOrder = 1 });
            tourImages.Add(new TourImage { Id = tourImageId++, TourId = tourId, MediaAssetId = mediaIdByFile[$"{b}1.webp"], IsPrimary = false, SortOrder = 2 });
            tourImages.Add(new TourImage { Id = tourImageId++, TourId = tourId, MediaAssetId = mediaIdByFile[$"{b}2.webp"], IsPrimary = false, SortOrder = 3 });
        }
        modelBuilder.Entity<TourImage>().HasData(tourImages);

        // 7. TourSchedules (42 rows)
        var schedules = new List<TourSchedule>();
        int scheduleId = 1;
        for (int tourId = 1; tourId <= 21; tourId++)
        {
            decimal basePrice = tourId switch
            {
                <= 9 => 3500000,
                <= 15 => 3300000,
                <= 17 => 2800000,
                <= 19 => 2300000,
                _ => 3600000
            };

            schedules.Add(new TourSchedule
            {
                Id = scheduleId++,
                TourId = tourId,
                DepartureDate = fixedDate.AddDays(tourId + 5),
                ReturnDate = fixedDate.AddDays(tourId + 8),
                AdultPrice = basePrice + (tourId * 50000),
                ChildPrice = (basePrice + (tourId * 50000)) * 0.7m,
                Quota = 25,
                AvailableSeats = 12,
                Status = "Available"
            });

            var status2 = tourId % 3 == 0 ? "Full" : "Available";
            schedules.Add(new TourSchedule
            {
                Id = scheduleId++,
                TourId = tourId,
                DepartureDate = fixedDate.AddDays(tourId + 15),
                ReturnDate = fixedDate.AddDays(tourId + 18),
                AdultPrice = basePrice + (tourId * 70000),
                ChildPrice = (basePrice + (tourId * 70000)) * 0.7m,
                Quota = 25,
                AvailableSeats = status2 == "Full" ? 0 : 8,
                Status = status2
            });
        }
        modelBuilder.Entity<TourSchedule>().HasData(schedules);

        // 8. Bookings (20 rows)
        var bookingSeeds = new List<Booking>();
        var transactionSeeds = new List<Transaction>();
        var attendeeSeeds = new List<BookingAttendee>();

        var attendeeNames = new[]
        {
            "Nguyễn Minh Anh","Trần Thu Hằng","Lê Quốc Cường","Phạm Ngọc Diễm","Hoàng Gia Bảo",
            "Đỗ Khánh Linh","Võ Thành Nam","Bùi Thanh Mai","Ngô Đức Long","Phan Quang Huy",
            "Nguyễn Gia Hân","Trần Quốc Việt","Lý Hoàng Nam","Đặng Bảo Trân","Phạm Nhật Long",
            "Vũ Khánh Vy","Lê Minh Tâm","Đỗ Quốc Đạt","Nguyễn Hoài Phương","Hoàng Tuấn Kiệt"
        };

        for (int i = 1; i <= 20; i++)
        {
            var scheduleRef = i;
            var userRef = (i % 9) + 1;
            var passengers = (i % 3) + 1;
            var bookingStatus = i % 4 == 0 ? "Cancelled" : (i % 3 == 0 ? "Pending" : "Confirmed");
            var total = 1500000 + i * 250000;

            bookingSeeds.Add(new Booking
            {
                Id = i,
                UserId = userRef,
                TourScheduleId = scheduleRef,
                TotalPassengers = passengers,
                TotalPrice = total,
                Status = bookingStatus,
                CreatedAt = fixedDate.AddDays(i)
            });

            transactionSeeds.Add(new Transaction
            {
                Id = i,
                BookingId = i,
                TransactionCode = $"TRANS{i:000}",
                Amount = total,
                PaymentMethod = i % 2 == 0 ? "VNPay" : "Momo",
                Status = bookingStatus == "Confirmed" ? "Success" : (bookingStatus == "Pending" ? "Pending" : "Failed"),
                CreatedAt = fixedDate.AddDays(i)
            });

            attendeeSeeds.Add(new BookingAttendee
            {
                Id = i,
                BookingId = i,
                FullName = attendeeNames[i - 1],
                DateOfBirth = i == 8 ? new DateTime(2016, 8, 8) : new DateTime(1988 + (i % 12), (i % 12) + 1, (i % 27) + 1),
                Type = i == 8 ? "Child" : "Adult"
            });
        }

        modelBuilder.Entity<Booking>().HasData(bookingSeeds);

        // 9. Transactions (20 rows)
        modelBuilder.Entity<Transaction>().HasData(transactionSeeds);

        // 10. Vouchers (10 rows)
        modelBuilder.Entity<Voucher>().HasData(
            new Voucher { Id = 1, Code = "SUMMER10", DiscountType = "Percentage", DiscountValue = 10, Quantity = 120, ExpiryDate = fixedDate.AddMonths(3) },
            new Voucher { Id = 2, Code = "SALE200K", DiscountType = "FixedAmount", DiscountValue = 200000, Quantity = 80, ExpiryDate = fixedDate.AddMonths(2) },
            new Voucher { Id = 3, Code = "NEWUSER", DiscountType = "Percentage", DiscountValue = 15, Quantity = 300, ExpiryDate = fixedDate.AddMonths(6) },
            new Voucher { Id = 4, Code = "VIP500K", DiscountType = "FixedAmount", DiscountValue = 500000, Quantity = 25, ExpiryDate = fixedDate.AddMonths(1) },
            new Voucher { Id = 5, Code = "HOLIDAY20", DiscountType = "Percentage", DiscountValue = 20, Quantity = 60, ExpiryDate = fixedDate.AddMonths(4) },
            new Voucher { Id = 6, Code = "FLASH100K", DiscountType = "FixedAmount", DiscountValue = 100000, Quantity = 100, ExpiryDate = fixedDate.AddDays(15) },
            new Voucher { Id = 7, Code = "WEEKEND5", DiscountType = "Percentage", DiscountValue = 5, Quantity = 150, ExpiryDate = fixedDate.AddMonths(2) },
            new Voucher { Id = 8, Code = "TRAVEL50K", DiscountType = "FixedAmount", DiscountValue = 50000, Quantity = 200, ExpiryDate = fixedDate.AddMonths(3) },
            new Voucher { Id = 9, Code = "FAMILY12", DiscountType = "Percentage", DiscountValue = 12, Quantity = 70, ExpiryDate = fixedDate.AddMonths(5) },
            new Voucher { Id = 10, Code = "LASTMIN8", DiscountType = "Percentage", DiscountValue = 8, Quantity = 40, ExpiryDate = fixedDate.AddDays(10) }
        );

        // 11. Reviews (20 rows)
        modelBuilder.Entity<Review>().HasData(
            new Review { Id = 1, UserId = 2, TourId = 1, Rating = 5, Comment = "Tour Côn Đảo rất chỉn chu, lịch trình vừa sức và HDV hỗ trợ nhiệt tình.", CreatedAt = fixedDate.AddDays(1) },
            new Review { Id = 2, UserId = 3, TourId = 2, Rating = 4, Comment = "Phú Quốc đẹp, resort sạch, bữa sáng ổn. Điểm trừ nhỏ là chờ check-in hơi lâu.", CreatedAt = fixedDate.AddDays(2) },
            new Review { Id = 3, UserId = 4, TourId = 3, Rating = 5, Comment = "Nha Trang biển đẹp, xe đưa đón đúng giờ, gia đình mình rất hài lòng.", CreatedAt = fixedDate.AddDays(3) },
            new Review { Id = 4, UserId = 5, TourId = 4, Rating = 4, Comment = "Phú Yên yên bình, cảnh đẹp tự nhiên, phù hợp nghỉ ngắn ngày cuối tuần.", CreatedAt = fixedDate.AddDays(4) },
            new Review { Id = 5, UserId = 6, TourId = 5, Rating = 5, Comment = "Du thuyền Hạ Long đáng tiền, đồ ăn ngon, hướng dẫn viên chuyên nghiệp.", CreatedAt = fixedDate.AddDays(5) },
            new Review { Id = 6, UserId = 7, TourId = 6, Rating = 3, Comment = "Đà Nẵng ổn, nhưng thời gian tham quan Bà Nà hơi gấp.", CreatedAt = fixedDate.AddDays(6) },
            new Review { Id = 7, UserId = 8, TourId = 7, Rating = 4, Comment = "Quy Nhơn biển trong, khách sạn gần trung tâm nên đi lại thuận tiện.", CreatedAt = fixedDate.AddDays(7) },
            new Review { Id = 8, UserId = 9, TourId = 8, Rating = 4, Comment = "Ninh Thuận nắng đẹp, lịch trình hợp lý, ảnh chụp lên rất đẹp.", CreatedAt = fixedDate.AddDays(8) },
            new Review { Id = 9, UserId = 1, TourId = 9, Rating = 3, Comment = "Phan Thiết ổn, nhưng dịch vụ ăn trưa cần cải thiện thêm.", CreatedAt = fixedDate.AddDays(9) },
            new Review { Id = 10, UserId = 2, TourId = 10, Rating = 5, Comment = "Đà Lạt thời tiết đẹp, lịch nhẹ nhàng, phù hợp gia đình có người lớn tuổi.", CreatedAt = fixedDate.AddDays(10) },

            new Review { Id = 11, UserId = 3, TourId = 11, Rating = 4, Comment = "Mộc Châu mùa hoa rất đáng đi, homestay sạch sẽ và view đẹp.", CreatedAt = fixedDate.AddDays(11) },
            new Review { Id = 12, UserId = 4, TourId = 12, Rating = 5, Comment = "Sa Pa mây đẹp, xe di chuyển an toàn, HDV rất có tâm.", CreatedAt = fixedDate.AddDays(12) },
            new Review { Id = 13, UserId = 5, TourId = 13, Rating = 4, Comment = "Hà Giang cảnh hùng vĩ, nhưng đường đèo dài nên hơi mệt với người lớn tuổi.", CreatedAt = fixedDate.AddDays(13) },
            new Review { Id = 14, UserId = 6, TourId = 14, Rating = 4, Comment = "Buôn Ma Thuột thú vị, đặc biệt là bảo tàng cà phê và trải nghiệm địa phương.", CreatedAt = fixedDate.AddDays(14) },
            new Review { Id = 15, UserId = 7, TourId = 15, Rating = 5, Comment = "Cao Bằng đẹp ngoài mong đợi, lịch trình hợp lý và không bị quá dồn.", CreatedAt = fixedDate.AddDays(15) },
            new Review { Id = 16, UserId = 8, TourId = 16, Rating = 4, Comment = "Huế trầm lắng, đồ ăn ngon, phù hợp cho chuyến đi thư giãn.", CreatedAt = fixedDate.AddDays(16) },
            new Review { Id = 17, UserId = 9, TourId = 17, Rating = 5, Comment = "Ninh Bình đi 1 ngày rất tiện, cảnh Tràng An đẹp và dễ đi.", CreatedAt = fixedDate.AddDays(17) },
            new Review { Id = 18, UserId = 1, TourId = 18, Rating = 4, Comment = "Cần Thơ chợ nổi thú vị, nên đi sớm để trải nghiệm trọn vẹn hơn.", CreatedAt = fixedDate.AddDays(18) },
            new Review { Id = 19, UserId = 2, TourId = 19, Rating = 3, Comment = "Tây Ninh ổn cho chuyến đi ngắn, cần thêm thời gian ở điểm tham quan chính.", CreatedAt = fixedDate.AddDays(19) },
            new Review { Id = 20, UserId = 3, TourId = 20, Rating = 5, Comment = "Đảo Phú Quý biển rất đẹp, chi phí hợp lý, đáng đi lại lần nữa.", CreatedAt = fixedDate.AddDays(20) }
        );

        // 12. BookingAttendees (20 rows)
        modelBuilder.Entity<BookingAttendee>().HasData(attendeeSeeds);

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

        // 15. NewsPosts (20 rows)
        modelBuilder.Entity<NewsPost>().HasData(
            new NewsPost { Id = 1, Title = "Top 7 trải nghiệm không thể bỏ lỡ ở Phú Quốc mùa hè", Slug = "top-7-trai-nghiem-phu-quoc-mua-he", Summary = "Lịch trình 3N2Đ khám phá đảo ngọc với chi phí tối ưu.", Content = "Từ cáp treo Hòn Thơm, lặn ngắm san hô đến sunset thị trấn Hoàng Hôn — Phú Quốc có đủ trải nghiệm nghỉ dưỡng và vui chơi cho cả gia đình.", CategoryId = 1, AuthorId = 1, Status = "Published", IsFeatured = true, ViewCount = 2180, ThumbnailUrl = "/uploads/media/PhuQuoc.webp", CreatedAt = fixedDate.AddDays(1), UpdatedAt = fixedDate.AddDays(2) },

            new NewsPost { Id = 2, Title = "Đà Nẵng 3N2Đ: lịch trình gọn đẹp cho người đi lần đầu", Slug = "da-nang-3n2d-lich-trinh-goi-y", Summary = "Biển Mỹ Khê, Bà Nà, Hội An trong một hành trình vừa sức.", Content = "Ngày 1 dạo biển và trung tâm thành phố, ngày 2 đi Bà Nà Hills, ngày 3 kết hợp Hội An là lịch trình hợp lý cho nhóm bạn hoặc gia đình.", CategoryId = 3, AuthorId = 2, Status = "Published", IsFeatured = true, ViewCount = 1960, ThumbnailUrl = "/uploads/media/DaNang.webp", CreatedAt = fixedDate.AddDays(2), UpdatedAt = fixedDate.AddDays(3) },

            new NewsPost { Id = 3, Title = "Ăn gì ở Nha Trang? 10 món địa phương nên thử", Slug = "an-gi-o-nha-trang-10-mon-nen-thu", Summary = "Bún sứa, bánh căn, hải sản đêm và quán local chất lượng.", Content = "Nha Trang không chỉ có biển đẹp mà còn nổi tiếng bởi văn hóa ẩm thực đa dạng, giá hợp lý và dễ tìm quanh khu trung tâm.", CategoryId = 4, AuthorId = 3, Status = "Published", IsFeatured = false, ViewCount = 1510, ThumbnailUrl = "/uploads/media/NhaTrang2.webp", CreatedAt = fixedDate.AddDays(3), UpdatedAt = fixedDate.AddDays(4) },

            new NewsPost { Id = 4, Title = "Phú Yên cuối tuần: đi đâu để có ảnh đẹp mà không quá đông?", Slug = "phu-yen-cuoi-tuan-goi-y-diem-den", Summary = "Gành Đá Đĩa, Bãi Xép, cung đường ven biển cực chill.", Content = "Phú Yên phù hợp cho chuyến đi ngắn 2N1Đ với nhịp độ chậm, cảnh đẹp tự nhiên và nhiều điểm check-in sát biển.", CategoryId = 5, AuthorId = 4, Status = "Published", IsFeatured = false, ViewCount = 1320, ThumbnailUrl = "/uploads/media/PhuYen1.webp", CreatedAt = fixedDate.AddDays(4), UpdatedAt = fixedDate.AddDays(5) },

            new NewsPost { Id = 5, Title = "Vịnh Hạ Long nên đi tự túc hay đi tour?", Slug = "vinh-ha-long-tu-tuc-hay-di-tour", Summary = "So sánh chi phí, trải nghiệm và độ tiện lợi cho từng lựa chọn.", Content = "Nếu muốn nghỉ ngơi, đi tour trọn gói sẽ tiết kiệm thời gian. Nếu thích chủ động check-in, bạn có thể tự túc kết hợp du thuyền ngày.", CategoryId = 6, AuthorId = 5, Status = "Published", IsFeatured = true, ViewCount = 1850, ThumbnailUrl = "/uploads/media/VinhHaLongLong.webp", CreatedAt = fixedDate.AddDays(5), UpdatedAt = fixedDate.AddDays(6) },

            new NewsPost { Id = 6, Title = "Đà Lạt tháng nào đẹp nhất? Gợi ý theo từng mùa", Slug = "da-lat-thang-nao-dep-nhat", Summary = "Mùa hoa, mùa mưa và thời điểm săn mây lý tưởng.", Content = "Đà Lạt có nét đẹp riêng mỗi mùa: đầu năm hoa nở rực rỡ, giữa năm xanh mát, cuối năm thời tiết lạnh và phù hợp săn mây buổi sớm.", CategoryId = 3, AuthorId = 6, Status = "Published", IsFeatured = true, ViewCount = 2100, ThumbnailUrl = "/uploads/media/DaLat1.webp", CreatedAt = fixedDate.AddDays(6), UpdatedAt = fixedDate.AddDays(7) },

            new NewsPost { Id = 7, Title = "Sa Pa mùa mây: checklist đồ cần mang theo", Slug = "sapa-mua-may-checklist-can-mang", Summary = "Trang phục, thuốc cơ bản, giày trekking và mẹo giữ ấm.", Content = "Nhiệt độ Sa Pa chênh lệch ngày đêm lớn, nên chuẩn bị áo khoác chống gió, giày bám tốt và kế hoạch di chuyển linh hoạt theo thời tiết.", CategoryId = 7, AuthorId = 7, Status = "Published", IsFeatured = false, ViewCount = 1240, ThumbnailUrl = "/uploads/media/Sapa.webp", CreatedAt = fixedDate.AddDays(7), UpdatedAt = fixedDate.AddDays(8) },

            new NewsPost { Id = 8, Title = "Hà Giang an toàn hơn khi đi xe máy: 8 lưu ý bắt buộc", Slug = "ha-giang-8-luu-y-an-toan-xe-may", Summary = "Kinh nghiệm thực tế cho người mới đi cung đèo.", Content = "Không chạy đêm, kiểm tra phanh/lốp trước khi đi, luôn mang giấy tờ và theo dõi dự báo thời tiết là các nguyên tắc quan trọng nhất.", CategoryId = 7, AuthorId = 8, Status = "Published", IsFeatured = true, ViewCount = 1730, ThumbnailUrl = "/uploads/media/HaGiang1.webp", CreatedAt = fixedDate.AddDays(8), UpdatedAt = fixedDate.AddDays(9) },

            new NewsPost { Id = 9, Title = "Mộc Châu mùa hoa mận: đi đâu, ăn gì, ở đâu?", Slug = "moc-chau-mua-hoa-man-kinh-nghiem", Summary = "Combo điểm đến + homestay + món ngon địa phương.", Content = "Mộc Châu đẹp nhất khi hoa nở trắng đồi. Bạn có thể kết hợp đồi chè trái tim, rừng thông và các bản làng văn hóa.", CategoryId = 3, AuthorId = 9, Status = "Published", IsFeatured = false, ViewCount = 980, ThumbnailUrl = "/uploads/media/MocChau.webp", CreatedAt = fixedDate.AddDays(9), UpdatedAt = fixedDate.AddDays(10) },

            new NewsPost { Id = 10, Title = "Buôn Ma Thuột 2N1Đ: cà phê, thác nước và văn hóa Tây Nguyên", Slug = "buon-ma-thuot-2n1d-goi-y", Summary = "Hành trình ngắn gọn nhưng đủ trải nghiệm đặc trưng.", Content = "Khám phá làng cà phê, bảo tàng thế giới cà phê và các điểm thác nổi bật quanh thành phố là lựa chọn rất đáng thử.", CategoryId = 6, AuthorId = 1, Status = "Published", IsFeatured = false, ViewCount = 860, ThumbnailUrl = "/uploads/media/BuonMaThuot.webp", CreatedAt = fixedDate.AddDays(10), UpdatedAt = fixedDate.AddDays(11) },

            new NewsPost { Id = 11, Title = "Cao Bằng và thác Bản Giốc: đi tự túc cần chuẩn bị gì?", Slug = "cao-bang-ban-gioc-kinh-nghiem-tu-tuc", Summary = "Kinh nghiệm di chuyển xa, đặt phòng và ăn uống vùng cao.", Content = "Cao Bằng phù hợp với ai thích thiên nhiên hùng vĩ. Bạn nên lên kế hoạch sớm để có lịch trình hợp lý và tiết kiệm thời gian di chuyển.", CategoryId = 5, AuthorId = 2, Status = "Published", IsFeatured = false, ViewCount = 910, ThumbnailUrl = "/uploads/media/CaoBang.webp", CreatedAt = fixedDate.AddDays(11), UpdatedAt = fixedDate.AddDays(12) },

            new NewsPost { Id = 12, Title = "Huế không chỉ có Đại Nội: 6 trải nghiệm nên thử", Slug = "hue-6-trai-nghiem-nen-thu", Summary = "Ẩm thực, di sản, nhịp sống chậm đầy chiều sâu.", Content = "Ngoài Đại Nội, Huế còn hấp dẫn bởi lăng tẩm, phố cổ, ẩm thực cung đình và không gian đậm chất văn hóa miền Trung.", CategoryId = 1, AuthorId = 3, Status = "Published", IsFeatured = true, ViewCount = 1420, ThumbnailUrl = "/uploads/media/Hue.webp", CreatedAt = fixedDate.AddDays(12), UpdatedAt = fixedDate.AddDays(13) },

            new NewsPost { Id = 13, Title = "Ninh Bình 1 ngày: Tràng An - Hang Múa - Hoa Lư", Slug = "ninh-binh-1-ngay-lich-trinh", Summary = "Lịch trình tối ưu cho chuyến đi ngắn từ Hà Nội.", Content = "Bạn có thể đi sớm, tham quan Tràng An buổi sáng, chiều lên Hang Múa săn hoàng hôn và kết thúc bằng ẩm thực dê núi đặc trưng.", CategoryId = 5, AuthorId = 4, Status = "Published", IsFeatured = false, ViewCount = 1670, ThumbnailUrl = "/uploads/media/NinhBinh1.webp", CreatedAt = fixedDate.AddDays(13), UpdatedAt = fixedDate.AddDays(14) },

            new NewsPost { Id = 14, Title = "Ninh Thuận mùa nắng đẹp: cung đường biển cực chill", Slug = "ninh-thuan-cung-duong-bien-cuc-chill", Summary = "Vĩnh Hy, Hang Rái, đồi cát và vườn nho trong một hành trình.", Content = "Ninh Thuận là điểm đến tuyệt vời cho team yêu nắng gió, ảnh đẹp và các hoạt động ngoài trời như trekking nhẹ, tắm biển, check-in đồi cát.", CategoryId = 5, AuthorId = 5, Status = "Published", IsFeatured = true, ViewCount = 1560, ThumbnailUrl = "/uploads/media/NinhThuan.webp", CreatedAt = fixedDate.AddDays(14), UpdatedAt = fixedDate.AddDays(15) },

            new NewsPost { Id = 15, Title = "Phan Thiết - Mũi Né: lịch trình gia đình 3 ngày 2 đêm", Slug = "phan-thiet-mui-ne-gia-dinh-3n2d", Summary = "Gợi ý lịch nhẹ nhàng cho gia đình có trẻ nhỏ.", Content = "Ưu tiên resort gần biển, kết hợp tham quan đồi cát, làng chài và các điểm vui chơi dễ di chuyển.", CategoryId = 9, AuthorId = 6, Status = "Draft", IsFeatured = false, ViewCount = 720, ThumbnailUrl = "/uploads/media/PhanThiet1.webp", CreatedAt = fixedDate.AddDays(15), UpdatedAt = fixedDate.AddDays(16) },

            new NewsPost { Id = 16, Title = "Cần Thơ buổi sớm: đi chợ nổi thế nào cho trọn vẹn?", Slug = "can-tho-di-cho-noi-kinh-nghiem", Summary = "Khung giờ đẹp, cách thuê thuyền và món ăn nên thử.", Content = "Nên đi từ sớm để cảm nhận trọn không khí giao thương trên sông. Bún riêu, hủ tiếu và trái cây tại thuyền là trải nghiệm rất đáng nhớ.", CategoryId = 4, AuthorId = 7, Status = "Published", IsFeatured = false, ViewCount = 1340, ThumbnailUrl = "/uploads/media/CanTho.webp", CreatedAt = fixedDate.AddDays(16), UpdatedAt = fixedDate.AddDays(17) },

            new NewsPost { Id = 17, Title = "Tây Ninh trong ngày: Núi Bà Đen và đặc sản địa phương", Slug = "tay-ninh-trong-ngay-nui-ba-den", Summary = "Trip ngắn cho cuối tuần từ TP.HCM.", Content = "Bạn có thể đi cáp treo lên núi, tham quan chùa và thưởng thức bánh tráng phơi sương, muối tôm — đặc sản nổi tiếng của Tây Ninh.", CategoryId = 10, AuthorId = 8, Status = "Published", IsFeatured = false, ViewCount = 990, ThumbnailUrl = "/uploads/media/TayNinh1.webp", CreatedAt = fixedDate.AddDays(17), UpdatedAt = fixedDate.AddDays(18) },

            new NewsPost { Id = 18, Title = "Đảo Phú Quý có gì hay? Cập nhật chi phí mới nhất", Slug = "dao-phu-quy-cap-nhat-chi-phi", Summary = "Tổng hợp chi phí tàu, lưu trú, ăn uống và thuê xe.", Content = "Phú Quý phù hợp cho người thích biển hoang sơ. Chi phí vừa phải, trải nghiệm địa phương chân thực và nhiều góc ảnh đẹp tự nhiên.", CategoryId = 8, AuthorId = 9, Status = "Published", IsFeatured = true, ViewCount = 1440, ThumbnailUrl = "/uploads/media/DaoPhuQuy.webp", CreatedAt = fixedDate.AddDays(18), UpdatedAt = fixedDate.AddDays(19) },

            new NewsPost { Id = 19, Title = "Quảng Bình 2N1Đ: đi Phong Nha hay động Thiên Đường trước?", Slug = "quang-binh-2n1d-phong-nha-hay-thien-duong", Summary = "So sánh thời gian, trải nghiệm và lịch tối ưu.", Content = "Nếu đi lần đầu, bạn nên ưu tiên động Thiên Đường buổi sáng và Phong Nha buổi chiều để giảm đông, thuận tiện chụp ảnh và di chuyển.", CategoryId = 3, AuthorId = 1, Status = "Published", IsFeatured = false, ViewCount = 1280, ThumbnailUrl = "/uploads/media/QuangBinh2.webp", CreatedAt = fixedDate.AddDays(19), UpdatedAt = fixedDate.AddDays(20) },

            new NewsPost { Id = 20, Title = "Khuyến mãi tháng 5/2026: săn tour biển giá tốt", Slug = "khuyen-mai-thang-5-2026-san-tour-bien", Summary = "Nhiều tuyến biển giảm giá, áp dụng số lượng có hạn.", Content = "Các tuyến Đà Nẵng, Nha Trang, Phú Quốc và Quy Nhơn đang có mức giá tốt theo khung khởi hành cố định. Đặt sớm để giữ chỗ đẹp.", CategoryId = 2, AuthorId = 2, Status = "Published", IsFeatured = true, ViewCount = 2210, ThumbnailUrl = "/uploads/media/QuyNhon.webp", CreatedAt = fixedDate.AddDays(20), UpdatedAt = fixedDate.AddDays(21) }
        );

        // 16. NewsTagMaps (20 rows)
        modelBuilder.Entity<NewsTagMap>().HasData(
            new NewsTagMap { NewsPostId = 1, NewsTagId = 1 },   // biển
            new NewsTagMap { NewsPostId = 2, NewsTagId = 4 },   // kinh nghiệm
            new NewsTagMap { NewsPostId = 3, NewsTagId = 3 },   // ẩm thực
            new NewsTagMap { NewsPostId = 4, NewsTagId = 5 },   // check-in
            new NewsTagMap { NewsPostId = 5, NewsTagId = 6 },   // review tour
            new NewsTagMap { NewsPostId = 6, NewsTagId = 4 },   // kinh nghiệm
            new NewsTagMap { NewsPostId = 7, NewsTagId = 2 },   // núi
            new NewsTagMap { NewsPostId = 8, NewsTagId = 7 },   // phượt
            new NewsTagMap { NewsPostId = 9, NewsTagId = 2 },   // núi
            new NewsTagMap { NewsPostId = 10, NewsTagId = 6 },  // review tour

            new NewsTagMap { NewsPostId = 11, NewsTagId = 4 },  // kinh nghiệm
            new NewsTagMap { NewsPostId = 12, NewsTagId = 6 },  // review
            new NewsTagMap { NewsPostId = 13, NewsTagId = 5 },  // check-in
            new NewsTagMap { NewsPostId = 14, NewsTagId = 5 },  // check-in
            new NewsTagMap { NewsPostId = 15, NewsTagId = 9 },  // gia đình
            new NewsTagMap { NewsPostId = 16, NewsTagId = 3 },  // ẩm thực
            new NewsTagMap { NewsPostId = 17, NewsTagId = 4 },  // kinh nghiệm
            new NewsTagMap { NewsPostId = 18, NewsTagId = 1 },  // biển
            new NewsTagMap { NewsPostId = 19, NewsTagId = 7 },  // phượt
            new NewsTagMap { NewsPostId = 20, NewsTagId = 10 }  // khuyến mãi
        );
    }
}