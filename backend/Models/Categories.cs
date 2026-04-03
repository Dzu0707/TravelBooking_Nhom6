using System.ComponentModel.DataAnnotations; // PHẢI CÓ DÒNG NÀY

namespace TravelTour.API.Models;

public class Category {
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Tên danh mục không được để trống")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên phải từ 3-100 ký tự")]
    public string Name { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;

    public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();
}