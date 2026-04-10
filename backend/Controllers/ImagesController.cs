using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
[ApiController]
public class ImagesController : ControllerBase {
    private readonly IWebHostEnvironment _env;
    private readonly TravelDbContext _context;

    public ImagesController(IWebHostEnvironment env, TravelDbContext context) {
        _env = env;
        _context = context;
    }

    // Dùng khi Admin muốn thêm lẻ 1 ảnh vào album của Tour đã có sẵn
    [HttpPost("upload/{tourId}")]
    public async Task<IActionResult> Upload(int tourId, IFormFile file) {
        if (file == null || file.Length == 0) return BadRequest("File trống");

        var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var folder = Path.Combine(wwwPath, "uploads", "tours");
        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var fullPath = Path.Combine(folder, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create)) {
            await file.CopyToAsync(stream);
        }

        var tourImage = new TourImage {
            TourId = tourId,
            ImageUrl = $"/uploads/tours/{fileName}",
            IsPrimary = false
        };

        _context.TourImages.Add(tourImage);
        await _context.SaveChangesAsync();

        return Ok(new { id = tourImage.Id, url = tourImage.ImageUrl });
    }

    // Dùng khi Admin bấm nút [X] xóa 1 ảnh trong album
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var image = await _context.TourImages.FindAsync(id);
        if (image == null) return NotFound();

        // Xóa file vật lý
        var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var fullPath = Path.Combine(wwwPath, image.ImageUrl.TrimStart('/'));
        
        if (System.IO.File.Exists(fullPath)) {
            System.IO.File.Delete(fullPath);
        }

        _context.TourImages.Remove(image);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa ảnh thành công" });
    }
}