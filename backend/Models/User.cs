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

    public string Phone { get; set; } = string.Empty;
    public virtual Role? Role { get; set; }

    public bool IsLocked { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public string? ResetPasswordToken { get; set; }

    public DateTime? ResetPasswordTokenExpiry { get; set; }

    [JsonIgnore]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [JsonIgnore]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    [JsonIgnore]
    public virtual ICollection<NewsPost> AuthoredNewsPosts { get; set; } = new List<NewsPost>();

    [JsonIgnore]
    public virtual ICollection<NewsPost> PublishedNewsPosts { get; set; } = new List<NewsPost>();
    [JsonIgnore]
    public virtual ICollection<MediaAsset> UploadedMediaAssets { get; set; } = new List<MediaAsset>();

}
