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

    // Chỉ giữ lại NewsPost để tránh xung đột model cũ
    public DbSet<NewsPost> NewsPosts { get; set; }
    public DbSet<NewsCategory> NewsCategories { get; set; }
    public DbSet<NewsTag> NewsTags { get; set; }
    public DbSet<NewsTagMap> NewsTagMaps { get; set; }
    public DbSet<MediaAsset> MediaAssets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình decimal cho tất cả các cột kiểu decimal
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(decimal) || p.PropertyType == typeof(decimal?));

            foreach (var property in properties)
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property(property.Name)
                    .HasColumnType("decimal(18,2)");
            }
        }

        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<NewsCategory>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<NewsTag>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<NewsPost>().HasIndex(x => x.Slug).IsUnique();

        modelBuilder.Entity<TourImage>()
            .HasOne(ti => ti.Tour).WithMany(t => t.TourImages).HasForeignKey(ti => ti.TourId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TourSchedule>()
            .HasOne(ts => ts.Tour).WithMany(t => t.TourSchedules).HasForeignKey(ts => ts.TourId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NewsPost>()
            .HasOne(np => np.Category).WithMany(nc => nc.NewsPosts).HasForeignKey(np => np.CategoryId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NewsPost>()
            .HasOne(np => np.Author).WithMany(u => u.AuthoredNewsPosts).HasForeignKey(np => np.AuthorId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NewsPost>()
            .HasOne(np => np.PublishedBy).WithMany(u => u.PublishedNewsPosts).HasForeignKey(np => np.PublishedById).OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<NewsTagMap>().HasKey(x => new { x.NewsPostId, x.NewsTagId });
        modelBuilder.Entity<NewsTagMap>().HasOne(x => x.NewsPost).WithMany(x => x.NewsTagMaps).HasForeignKey(x => x.NewsPostId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<NewsTagMap>().HasOne(x => x.NewsTag).WithMany(x => x.NewsTagMaps).HasForeignKey(x => x.NewsTagId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MediaAsset>()
            .HasOne(x => x.UploadedBy).WithMany(u => u.UploadedMediaAssets).HasForeignKey(x => x.UploadedById).OnDelete(DeleteBehavior.Restrict);

        DbInitializer.Seed(modelBuilder);
    }
}