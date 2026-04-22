using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TravelTour.API.Models;

public class Review 
{
    [Key]
    public int Id { get; set; }
    
    // Khóa ngoại trỏ tới User
    [Required]
    public int UserId { get; set; }
    
    [ForeignKey("UserId")]
    public virtual User? User { get; set; } 

    // Khóa ngoại trỏ tới Tour
    [Required]
    public int TourId { get; set; }
    
    [ForeignKey("TourId")]
    // Dùng JsonIgnore nếu bạn không muốn tour bị lặp lại trong kết quả review
    [JsonIgnore] 
    public virtual Tour? Tour { get; set; } 

    [Range(1, 5, ErrorMessage = "Xếp hạng phải từ 1 đến 5 sao")]
    public int Rating { get; set; } 
    
    [Required(ErrorMessage = "Bình luận không được để trống")]
    [MaxLength(1000, ErrorMessage = "Bình luận không được quá 1000 ký tự")]
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    

}