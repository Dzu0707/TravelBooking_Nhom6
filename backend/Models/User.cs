using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TravelTour.API.Models;

public class User 
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Họ tên không được để trống")]
    public string FullName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Định dạng Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public int RoleId { get; set; }
    
    // --- ĐÃ SỬA CHỖ NÀY ---
    public string? Phone { get; set; }

    // --- ĐÃ SỬA CHỖ NÀY ---
    public string? Address { get; set; } 

    public virtual Role? Role { get; set; } 

    public bool IsLocked { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // CHỖ CẦN SỬA: Đổi Bookings -> Booking (số ít)
    [JsonIgnore]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    
    // CHỖ CẦN SỬA: Đổi Reviews -> Review (số ít)
    [JsonIgnore]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}