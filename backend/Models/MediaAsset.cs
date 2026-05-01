namespace TravelTour.API.Models;

public class MediaAsset
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }

    public int UploadedById { get; set; }
    public virtual User? UploadedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual ICollection<TourImage> TourImages { get; set; } = new List<TourImage>();
}
