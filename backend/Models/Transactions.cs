namespace TravelTour.API.Models;

public class Transaction {
    public int Id { get; set; }
    
    // Khóa ngoại trỏ về Booking
    public int BookingId { get; set; }
    public virtual Booking? Booking { get; set; } // Liên kết ngược tới đơn đặt tour

    public string TransactionCode { get; set; } = string.Empty; // Mã giao dịch (VNPAY, MoMo,...)
    
    public decimal Amount { get; set; }
    
    public string PaymentMethod { get; set; } = "Credit Card"; // Ví dụ: Cash, Banking, App
    
    public string Status { get; set; } = "Pending"; // Success, Failed, Pending

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}