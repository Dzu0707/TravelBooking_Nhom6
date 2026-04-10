using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; // Thêm thư viện này

namespace TravelTour.API.Models;

public class User {
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Họ tên không được để trống")]
    public string FullName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Định dạng Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    
    // Lưu mật khẩu đã mã hóa (BCrypt)
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public int RoleId { get; set; }
    
    public string Phone { get; set; } = string.Empty;
    public virtual Role? Role { get; set; } 

    public bool IsLocked { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Quan hệ: Dùng JsonIgnore để tránh lỗi khi trả về JSON
    [JsonIgnore]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    
    [JsonIgnore]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}