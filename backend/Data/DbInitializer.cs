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
            new Category { Id = 1, Name = "Du lịch Miền Tây", Description = "Khám phá sông nước miệt vườn" },
            new Category { Id = 2, Name = "Du lịch Biển Đảo", Description = "Nghỉ dưỡng tại các bãi biển đẹp" },
            new Category { Id = 3, Name = "Du lịch Núi", Description = "Trải nghiệm không khí vùng cao" }
        );

        // 3. Vouchers
        modelBuilder.Entity<Voucher>().HasData(
            new Voucher { Id = 1, Code = "WELCOME2026", DiscountType = "Percentage", DiscountValue = 10m, Quantity = 100, ExpiryDate = new DateTime(2026, 12, 31) },
            new Voucher { Id = 2, Code = "GIAM500K", DiscountType = "FixedAmount", DiscountValue = 500000m, Quantity = 50, ExpiryDate = new DateTime(2026, 06, 01) }
        );

        // 4. Users
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Nguyễn Admin", Email = "admin@travel.com", PasswordHash = "hashed_password", RoleId = 1, Phone = "0338083908", IsLocked = false, CreatedAt = fixedDate },
            new User { Id = 2, FullName = "Trần Khách Hàng", Email = "user@gmail.com", PasswordHash = "hashed_password", RoleId = 2, Phone = "0879390378", IsLocked = false, CreatedAt = fixedDate }
        );

        // 5. News Categories (Bắt buộc để NewsPost hoạt động)
        modelBuilder.Entity<NewsCategory>().HasData(
            new NewsCategory { Id = 1, Name = "Tin tức du lịch", Slug = "tin-tuc-du-lich" }
        );

        // 6. News Posts
        modelBuilder.Entity<NewsPost>().HasData(
            new NewsPost { 
                Id = 1, 
                Title = "Khám phá vẻ đẹp Đà Lạt", 
                Slug = "kham-pha-ve-dep-da-lat", 
                Summary = "Đà Lạt luôn là điểm đến hấp dẫn với không khí trong lành", 
                Content = "Nội dung chi tiết về Đà Lạt...", 
                ThumbnailUrl = "https://images.unsplash.com/photo-1635390059383-745100067332", 
                CategoryId = 1, 
                AuthorId = 1, 
                CreatedAt = fixedDate, 
                Status = "Published", 
                IsFeatured = true 
            }
        );

        // 7. Tours
        modelBuilder.Entity<Tour>().HasData(
            new Tour { Id = 1, Name = "Tour LA Home Long An", Code = "LA001", Description = "Trải nghiệm khu đô thị sinh thái", DepartureLocation = "TP.HCM", MinPrice = 2500000m, CategoryId = 1, CreatedAt = fixedDate },
            new Tour { Id = 2, Name = "Tour Phú Quốc Đảo Ngọc", Code = "PQ002", Description = "Lặn ngắm san hô", DepartureLocation = "TP.HCM", MinPrice = 5000000m, CategoryId = 2, CreatedAt = fixedDate }
        );

        // 8. TourImages & Schedules
        modelBuilder.Entity<TourImage>().HasData(
            new TourImage { Id = 1, TourId = 1, ImageUrl = "lahome_main.jpg", IsPrimary = true },
            new TourImage { Id = 2, TourId = 2, ImageUrl = "phuquoc_beach.jpg", IsPrimary = true }
        );

        modelBuilder.Entity<TourSchedule>().HasData(
            new TourSchedule { Id = 1, TourId = 1, DepartureDate = fixedDate.AddDays(30), ReturnDate = fixedDate.AddDays(32), AdultPrice = 2500000m, ChildPrice = 1800000m, Quota = 30, AvailableSeats = 28, Status = "Available" },
            new TourSchedule { Id = 2, TourId = 2, DepartureDate = fixedDate.AddDays(60), ReturnDate = fixedDate.AddDays(63), AdultPrice = 5000000m, ChildPrice = 3500000m, Quota = 20, AvailableSeats = 15, Status = "Available" }
        );

        // 9. Bookings
        modelBuilder.Entity<Booking>().HasData(
            new Booking { Id = 1, UserId = 2, TourScheduleId = 1, TotalPassengers = 2, TotalPrice = 5000000m, Status = "Confirmed", CreatedAt = fixedDate, VoucherId = 1 }
        );
    }
}