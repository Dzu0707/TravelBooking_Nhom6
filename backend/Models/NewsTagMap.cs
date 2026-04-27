namespace TravelTour.API.Models;

public class NewsTagMap
{
    public int NewsPostId { get; set; }
    public int NewsTagId { get; set; }

    public NewsPost NewsPost { get; set; } = null!;
    public NewsTag NewsTag { get; set; } = null!;
}