using Microsoft.EntityFrameworkCore;
using TravelTour.API.Models;

namespace TravelTour.API.Data;

public class TravelDbContext : DbContext
{
    public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options) { }

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
    public DbSet<News> News { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Cấu hình ràng buộc ---
        modelBuilder.Entity<Booking>().Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<TourSchedule>().Property(t => t.AdultPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<TourSchedule>().Property(t => t.ChildPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Transaction>().Property(t => t.Amount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Voucher>().Property(v => v.DiscountValue).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        // --- Xóa dữ liệu liên quan (Cascade Delete) ---
        modelBuilder.Entity<TourImage>().HasOne(ti => ti.Tour).WithMany(t => t.TourImages).HasForeignKey(ti => ti.TourId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TourSchedule>().HasOne(ts => ts.Tour).WithMany(t => t.TourSchedules).HasForeignKey(ts => ts.TourId).OnDelete(DeleteBehavior.Cascade);

        // --- SEED DATA (NẠP DỮ LIỆU MẪU TỰ ĐỘNG) ---
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "User" }
        );

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Biển Đảo", Description = "Du lịch biển" },
            new Category { Id = 2, Name = "Núi Rừng", Description = "Du lịch núi" }
        );

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Admin System", Email = "admin@test.com", PasswordHash = "hashed_pw", RoleId = 1 }
        );

        modelBuilder.Entity<Tour>().HasData(
            new Tour { Id = 1, Name = "Tour Hạ Long", Code = "HL01", CategoryId = 1, MinPrice = 1000, ImageUrl = "/uploads/tours/default.jpg" }
        );
    }
}