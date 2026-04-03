namespace TravelTour.API.Models;

public class TourImage {
    public int Id { get; set; }
    
    // Khóa ngoại kết nối tới Tour
    public int TourId { get; set; }
    public virtual Tour? Tour { get; set; } // Giúp truy cập ngược lại thông tin Tour nếu cần

    public string ImageUrl { get; set; } = string.Empty;
    
    // true: Ảnh chính (đại diện), false: Ảnh chi tiết/album
    public bool IsPrimary { get; set; }
}