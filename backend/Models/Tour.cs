using System.ComponentModel.DataAnnotations.Schema;

namespace TravelTour.API.Models;

public class Tour {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DepartureLocation { get; set; } = string.Empty;
    
    public string? ImageUrl { get; set; } 

    [Column(TypeName = "decimal(18,2)")]
    public decimal MinPrice { get; set; } = 0; // Đảm bảo luôn có giá trị mặc định

    public int CategoryId { get; set; }
    public virtual Category? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual ICollection<TourImage> TourImages { get; set; } = new List<TourImage>();
    public virtual ICollection<TourSchedule> TourSchedules { get; set; } = new List<TourSchedule>();
    
    // Đã xóa ImageFile ở đây vì đã có trong TourDto để xử lý riêng
}