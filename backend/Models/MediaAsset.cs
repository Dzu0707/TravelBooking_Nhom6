using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TravelTour.API.Models;

public class MediaAsset
{
    public int Id { get; set; }

    [Required]
    public string FileName { get; set; } = string.Empty;

    [Required]
    public string FileUrl { get; set; } = string.Empty;

    public string? AltText { get; set; }

    public int UploadedById { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [JsonIgnore]
    public virtual User? UploadedBy { get; set; }
}
