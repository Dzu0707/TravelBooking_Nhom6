using Microsoft.AspNetCore.Http;

namespace TravelTour.API.Models.Requests;

public class UploadMediaRequest
{
    public IFormFile File { get; set; } = default!;
    public string? AltText { get; set; }
    public string? CustomName { get; set; }
}

public class UploadAvatarRequest
{
    public IFormFile File { get; set; } = default!;
}