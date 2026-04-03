namespace TravelTour.API.Models;

public class BookingAttendee {
    public int Id { get; set; }
    
    // Khai báo Foreign Key
    public int BookingId { get; set; }
    
    public string FullName { get; set; } = string.Empty; // Khởi tạo để tránh lỗi null
    
    public DateTime DateOfBirth { get; set; }
    
    public string Type { get; set; } = "Adult"; // Mặc định là người lớn (Người lớn/Trẻ em)

    // Navigation Property: Giúp bạn lấy thông tin Booking từ Attendee dễ dàng
    // Ví dụ: attendee.Booking.TotalPrice
    public virtual Booking? Booking { get; set; } 
}