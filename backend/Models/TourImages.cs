namespace TravelTour.API.Models;

public class TourImage
{
    public int Id { get; set; }

    public int TourId { get; set; }
    public virtual Tour? Tour { get; set; }

    public int MediaAssetId { get; set; }
    public virtual MediaAsset? MediaAsset { get; set; }

    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; } = 0;
}
