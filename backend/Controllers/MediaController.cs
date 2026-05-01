using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class MediaController : ControllerBase
{
    private readonly TravelDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public MediaController(TravelDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.MediaAssets
            .Include(x => x.UploadedBy)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.FileName,
                x.FileUrl,
                x.AltText,
                x.CreatedAt,
                UploadedBy = x.UploadedBy != null ? x.UploadedBy.FullName : "Hệ thống/Manual"
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(
        [FromForm] IFormFile file,
        [FromForm] string? altText,
        [FromForm] string? customName)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "File không hợp lệ!" });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest(new { message = "Chỉ chấp nhận jpg, jpeg, png, webp!" });

        var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsRoot = Path.Combine(webRoot, "uploads", "media");

        if (!Directory.Exists(uploadsRoot))
            Directory.CreateDirectory(uploadsRoot);

        var rawName = string.IsNullOrWhiteSpace(customName)
            ? Path.GetFileNameWithoutExtension(file.FileName)
            : customName.Trim();

        var safeName = string.Concat(rawName.ToLowerInvariant().Select(c => char.IsLetterOrDigit(c) ? c : '-')).Trim('-');
        while (safeName.Contains("--"))
        {
            safeName = safeName.Replace("--", "-");
        }

        if (string.IsNullOrWhiteSpace(safeName))
        {
            safeName = "media";
        }

        var fileName = $"{safeName}-{DateTime.Now:yyyyMMddHHmmss}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileUrl = $"/uploads/media/{fileName}";
        var uploadedById = await GetCurrentUserIdAsync();

        var media = new MediaAsset
        {
            FileName = fileName,
            FileUrl = fileUrl,
            AltText = altText ?? safeName,
            UploadedById = uploadedById,
            CreatedAt = DateTime.Now
        };

        _context.MediaAssets.Add(media);
        await _context.SaveChangesAsync();

        return Ok(media);
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncFolder()
    {
        var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsRoot = Path.Combine(webRoot, "uploads", "media");

        if (!Directory.Exists(uploadsRoot))
            return BadRequest(new { message = "Thư mục chưa tồn tại!" });

        var files = Directory.GetFiles(uploadsRoot);
        var dbFiles = await _context.MediaAssets.Select(x => x.FileName).ToListAsync();

        var addedCount = 0;
        foreach (var path in files)
        {
            var fileName = Path.GetFileName(path);
            if (!dbFiles.Contains(fileName))
            {
                var media = new MediaAsset
                {
                    FileName = fileName,
                    FileUrl = $"/uploads/media/{fileName}",
                    AltText = "Auto Synced",
                    CreatedAt = DateTime.Now,
                    UploadedById = 10
                };

                _context.MediaAssets.Add(media);
                addedCount++;
            }
        }

        if (addedCount > 0)
        {
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = $"Đã đồng bộ {addedCount} ảnh mới từ thư mục vào hệ thống." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var media = await _context.MediaAssets.FindAsync(id);
        if (media == null)
        {
            return NotFound(new { message = "Không tìm thấy ảnh!" });
        }

        var isUsedByTour = await _context.TourImages.AnyAsync(x => x.MediaAssetId == id);
        if (isUsedByTour)
        {
            return BadRequest(new { message = "Ảnh đang được gắn vào tour, không thể xóa." });
        }

        var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        if (!string.IsNullOrWhiteSpace(media.FileUrl) && media.FileUrl.StartsWith("/"))
        {
            var relativePath = media.FileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var filePath = Path.Combine(webRoot, relativePath);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        _context.MediaAssets.Remove(media);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa ảnh!" });
    }

    private async Task<int> GetCurrentUserIdAsync()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }

        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (!string.IsNullOrWhiteSpace(userEmail))
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == userEmail);
            if (user != null)
            {
                return user.Id;
            }
        }

        return 10;
    }
}
