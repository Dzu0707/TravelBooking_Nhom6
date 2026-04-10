namespace TravelTour.API.Models;

public class Voucher {
    public int Id { get; set; }
    
    public string Code { get; set; } = string.Empty; // Ví dụ: "GIAM20", "SUMMER2026"
    
    // "Percentage" (Phần trăm) hoặc "FixedAmount" (Số tiền cố định)
    public string DiscountType { get; set; } = "Percentage"; 
    
    public decimal DiscountValue { get; set; }
    
    public int Quantity { get; set; } // Số lượng mã còn lại
    
    public DateTime ExpiryDate { get; set; }

    // Logic bổ sung (Không bắt buộc nhưng thầy sẽ thích):
    // Một Voucher có thể đã được áp dụng cho nhiều Booking
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}