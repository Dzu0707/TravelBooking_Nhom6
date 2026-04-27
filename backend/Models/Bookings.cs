namespace TravelTour.API.Models;

public class Booking {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TourScheduleId { get; set; }
    public int? VoucherId { get; set; } 
    public int TotalPassengers { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "Pending"; 
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation Properties (Quan hệ N-1)
    public virtual User? User { get; set; }
    public virtual TourSchedule? TourSchedule { get; set; }
    
    // Thêm quan hệ với Voucher để dễ dàng lấy thông tin giảm giá
    public virtual Voucher? Voucher { get; set; }

    // Navigation Property (Quan hệ 1-N)
    public virtual ICollection<BookingAttendee> BookingAttendees { get; set; } = new List<BookingAttendee>();
    
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
   
}