using Microsoft.EntityFrameworkCore; 
using TravelTour.API.Models;

namespace TravelTour.API.Data;

public class TravelDbContext : DbContext {
    public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options) {}

    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Tour> Tours { get; set; }
    public DbSet<TourImage> TourImages { get; set; }
    public DbSet<TourSchedule> TourSchedules { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<BookingAttendee> BookingAttendees { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Voucher> Vouchers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Định nghĩa kiểu decimal(18,2) cho các cột tiền tệ
        modelBuilder.Entity<Booking>().Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<TourSchedule>().Property(t => t.AdultPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<TourSchedule>().Property(t => t.ChildPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Transaction>().Property(t => t.Amount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Voucher>().Property(v => v.DiscountValue).HasColumnType("decimal(18,2)");

        // 2. Ràng buộc Email là duy nhất
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        // 3. SEED DATA CHO ROLES (Quan trọng để fix lỗi ID nhảy lên 3, 4)
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "User" }
        );
    }
}