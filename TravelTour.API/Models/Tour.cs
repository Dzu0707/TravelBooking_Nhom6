namespace TravelTour.API.Models;

public class Tour {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DepartureLocation { get; set; } = string.Empty;
    
    // Khóa ngoại trỏ về Category
    public int CategoryId { get; set; }
    public virtual Category? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // --- CÁC MỐI QUAN HỆ (Navigation Properties) ---
    
    // Một Tour có nhiều Ảnh
    public virtual ICollection<TourImage> TourImages { get; set; } = new List<TourImage>();

    // Một Tour có nhiều Lịch trình/Ngày khởi hành (Quan trọng để tính giá)
    public virtual ICollection<TourSchedule> TourSchedules { get; set; } = new List<TourSchedule>();

    // Một Tour có nhiều Đánh giá
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}