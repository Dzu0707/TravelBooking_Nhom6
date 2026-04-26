namespace TravelTour.API.Models;

public class Booking
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TourScheduleId { get; set; }
    public int? VoucherId { get; set; }

    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? SpecialRequest { get; set; }

    public int AdultCount { get; set; }
    public int ChildCount { get; set; }

    public int TotalPassengers { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual User? User { get; set; }
    public virtual TourSchedule? TourSchedule { get; set; }
    public virtual Voucher? Voucher { get; set; }

    public virtual ICollection<BookingAttendee> BookingAttendees { get; set; } = new List<BookingAttendee>();
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
