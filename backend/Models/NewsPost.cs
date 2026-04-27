namespace TravelTour.API.Models;

public class NewsPost
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public int CategoryId { get; set; }
    public int AuthorId { get; set; }
    public int? PublishedById { get; set; }
    public string Status { get; set; } = "Draft";
    public bool IsFeatured { get; set; }
    public int ViewCount { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public NewsCategory Category { get; set; } = null!;
    public User Author { get; set; } = null!;
    public User? PublishedBy { get; set; }
    public ICollection<NewsTagMap> NewsTagMaps { get; set; } = new List<NewsTagMap>();
}
