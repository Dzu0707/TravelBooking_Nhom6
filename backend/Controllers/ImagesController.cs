using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
[ApiController]
public class TourImagesController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly TravelDbContext _context;

    public TourImagesController(IWebHostEnvironment env, TravelDbContext context)
    {
        _env = env;
        _context = context;
    }

    [HttpPost("upload/{tourId}")]
    public async Task<IActionResult> Upload(int tourId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("File trống");
        }

        var tourExists = await _context.Tours.AnyAsync(t => t.Id == tourId);
        if (!tourExists)
        {
            return NotFound(new { message = "Không tìm thấy tour" });
        }

        try
        {
            var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var folder = Path.Combine(wwwPath, "uploads", "tours");

            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/tours/{fileName}";

            var mediaAsset = new MediaAsset
            {
                FileName = file.FileName,
                FileUrl = fileUrl,
                AltText = Path.GetFileNameWithoutExtension(file.FileName),
                UploadedById = 10,
                CreatedAt = DateTime.Now
            };

            _context.MediaAssets.Add(mediaAsset);
            await _context.SaveChangesAsync();

            var maxSortOrder = await _context.TourImages
                .Where(x => x.TourId == tourId)
                .Select(x => (int?)x.SortOrder)
                .MaxAsync() ?? 0;

            var tourImage = new TourImage
            {
                TourId = tourId,
                MediaAssetId = mediaAsset.Id,
                IsPrimary = false,
                SortOrder = maxSortOrder + 1
            };

            _context.TourImages.Add(tourImage);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = tourImage.Id,
                mediaAssetId = mediaAsset.Id,
                url = mediaAsset.FileUrl
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi server: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var image = await _context.TourImages
            .Include(x => x.MediaAsset)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (image == null)
        {
            return NotFound(new { message = "Không tìm thấy ảnh trong dữ liệu" });
        }

        var mediaAsset = image.MediaAsset;

        _context.TourImages.Remove(image);
        await _context.SaveChangesAsync();

        if (mediaAsset != null)
        {
            var stillUsedInTours = await _context.TourImages
                .AnyAsync(x => x.MediaAssetId == mediaAsset.Id);

            if (!stillUsedInTours)
            {
                try
                {
                    if (!string.IsNullOrWhiteSpace(mediaAsset.FileUrl) && mediaAsset.FileUrl.StartsWith("/"))
                    {
                        var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                        var relativePath = mediaAsset.FileUrl.TrimStart('/');
                        var fullPath = Path.Combine(wwwPath, relativePath);

                        if (System.IO.File.Exists(fullPath))
                        {
                            System.IO.File.Delete(fullPath);
                        }
                    }
                }
                catch (IOException)
                {
                }

                _context.MediaAssets.Remove(mediaAsset);
                await _context.SaveChangesAsync();
            }
        }

        return Ok(new { message = "Xóa ảnh thành công" });
    }
}
