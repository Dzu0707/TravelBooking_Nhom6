using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/[controller]")] // Route sẽ là api/TourImages
[ApiController]
public class TourImagesController : ControllerBase {
    private readonly IWebHostEnvironment _env;
    private readonly TravelDbContext _context;

    public TourImagesController(IWebHostEnvironment env, TravelDbContext context) {
        _env = env;
        _context = context;
    }

    // POST: api/TourImages/upload/5
    // Dùng khi Admin muốn thêm lẻ 1 ảnh vào album của Tour đã có sẵn
    [HttpPost("upload/{tourId}")]
    public async Task<IActionResult> Upload(int tourId, IFormFile file) {
        if (file == null || file.Length == 0) return BadRequest("File trống");

        try {
            var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var folder = Path.Combine(wwwPath, "uploads", "tours");
            
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
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
        } catch (Exception ex) {
            return StatusCode(500, $"Lỗi server: {ex.Message}");
        }
    }

    // DELETE: api/TourImages/11
    // Dùng khi Admin bấm nút [X] xóa 1 ảnh trong album
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var image = await _context.TourImages.FindAsync(id);
        
        if (image == null) {
            return NotFound(new { message = "Không tìm thấy ảnh trong dữ liệu" });
        }

        try {
            // 1. Xóa file vật lý trên ổ đĩa
            if (!string.IsNullOrEmpty(image.ImageUrl)) {
                var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                // Loại bỏ dấu gạch chéo đầu tiên để Path.Combine hoạt động đúng
                var relativePath = image.ImageUrl.TrimStart('/');
                var fullPath = Path.Combine(wwwPath, relativePath);
                
                if (System.IO.File.Exists(fullPath)) {
                    System.IO.File.Delete(fullPath);
                }
            }
        } catch (IOException) {
            // Nếu file đang bị lock, chúng ta vẫn tiếp tục xóa record trong DB 
            // hoặc log lỗi ở đây nếu cần thiết
        }

        // 2. Xóa record trong Database
        _context.TourImages.Remove(image);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa ảnh thành công" });
    }
}