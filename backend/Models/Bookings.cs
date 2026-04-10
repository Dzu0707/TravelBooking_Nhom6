namespace TravelTour.API.Models;

public class Booking {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TourScheduleId { get; set; }
    public int TotalPassengers { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "Pending"; // Nên có giá trị mặc định
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation Properties (Quan hệ N-1)
    public virtual User? User { get; set; }
    public virtual TourSchedule? TourSchedule { get; set; }

    // Navigation Property (Quan hệ 1-N) - CỰC KỲ QUAN TRỌNG
    // Giúp thầy thấy được danh sách người đi trong 1 đơn đặt tour
    public virtual ICollection<BookingAttendee> BookingAttendees { get; set; } = new List<BookingAttendee>();
    
    // Quan hệ với thanh toán (Nếu bạn định làm cả phần thanh toán)
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}