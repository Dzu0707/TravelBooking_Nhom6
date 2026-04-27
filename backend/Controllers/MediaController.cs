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
                UploadedBy = x.UploadedBy != null ? x.UploadedBy.FullName : "N/A"
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string? altText)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "File không hợp lệ!" });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest(new { message = "Chỉ chấp nhận jpg, jpeg, png, webp!" });

        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == userEmail);
        if (user == null)
            return Unauthorized(new { message = "Người dùng không tồn tại!" });

        var uploadsRoot = Path.Combine(_environment.ContentRootPath, "Uploads", "media");
        if (!Directory.Exists(uploadsRoot))
            Directory.CreateDirectory(uploadsRoot);

        var fileName = $"media_{DateTime.Now:yyyyMMddHHmmssfff}_{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var fileUrl = $"{baseUrl}/uploads/media/{fileName}";

        var media = new MediaAsset
        {
            FileName = fileName,
            FileUrl = fileUrl,
            AltText = altText,
            UploadedById = user.Id,
            CreatedAt = DateTime.Now
        };

        _context.MediaAssets.Add(media);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            media.Id,
            media.FileName,
            media.FileUrl,
            media.AltText
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var media = await _context.MediaAssets.FindAsync(id);
        if (media == null)
            return NotFound(new { message = "Không tìm thấy ảnh!" });

        var uploadsRoot = Path.Combine(_environment.ContentRootPath, "Uploads", "media");
        var filePath = Path.Combine(uploadsRoot, media.FileName);

        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        _context.MediaAssets.Remove(media);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa ảnh thành công!" });
    }
}
