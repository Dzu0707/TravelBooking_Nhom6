using Microsoft.EntityFrameworkCore; 
using TravelTour.API.Models;

namespace TravelTour.API.Data;

public class TravelDbContext : DbContext 
{
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

    public DbSet<News> News { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- 1. Tự động cấu hình Decimal cho tất cả các bảng ---
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(decimal) || p.PropertyType == typeof(decimal?));

            foreach (var property in properties)
            {
                modelBuilder.Entity(entityType.Name).Property(property.Name).HasColumnType("decimal(18,2)");
            }
        }

        // --- 2. Ràng buộc Index ---
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        // --- 3. Cấu hình Quan hệ & Cascade Delete ---
        modelBuilder.Entity<TourImage>()
            .HasOne(ti => ti.Tour)
            .WithMany(t => t.TourImages)
            .HasForeignKey(ti => ti.TourId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TourSchedule>()
            .HasOne(ts => ts.Tour)
            .WithMany(t => t.TourSchedules)
            .HasForeignKey(ts => ts.TourId)
            .OnDelete(DeleteBehavior.Cascade);

        // --- 4. Gọi Seed Data từ file DbInitializer ---
        DbInitializer.Seed(modelBuilder);
    }
}