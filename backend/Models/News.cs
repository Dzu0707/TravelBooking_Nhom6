using System.ComponentModel.DataAnnotations;

namespace TravelTour.API.Models
{
    public class News
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Category { get; set; } = string.Empty;
        
        public string Summary { get; set; } = string.Empty;
        
        public string Content { get; set; } = string.Empty;
        
        public string? ImageUrl { get; set; }
        
        public string Author { get; set; } = "Admin";
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsPublished { get; set; } = false; // Mặc định là Chưa duyệt
        public DateTime? ExpiryDate { get; set; }
    }
}