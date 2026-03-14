namespace TravelTour.API.Models;

public class Review {
    public int Id { get; set; }
    
    // Khóa ngoại trỏ tới User
    public int UserId { get; set; }
    public virtual User? User { get; set; } // Giúp lấy info người đánh giá

    // Khóa ngoại trỏ tới Tour
    public int TourId { get; set; }
    public virtual Tour? Tour { get; set; } // Giúp biết đánh giá cho tour nào

    public int Rating { get; set; } // Thường từ 1-5 sao
    
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}