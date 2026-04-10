namespace TravelTour.API.Models;

public class TourSchedule {
    public int Id { get; set; }
    
    // Khóa ngoại trỏ về Tour
    public int TourId { get; set; }
    public virtual Tour? Tour { get; set; } // Dùng virtual để hỗ trợ Lazy Loading

    public DateTime DepartureDate { get; set; }
    public DateTime ReturnDate { get; set; }
    
    public decimal AdultPrice { get; set; }
    public decimal ChildPrice { get; set; }
    
    public int Quota { get; set; } // Tổng số chỗ
    public int AvailableSeats { get; set; } // Số chỗ còn trống
    
    public string Status { get; set; } = "Active"; // Ví dụ: Active, Full, Cancelled

    // Quan hệ ngược: Một lịch trình có nhiều đơn đặt (Bookings)
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}