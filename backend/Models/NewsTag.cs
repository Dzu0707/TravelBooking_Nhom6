namespace TravelTour.API.Models;

public class NewsTag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<NewsTagMap> NewsTagMaps { get; set; } = new List<NewsTagMap>();
}
