using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ToursController : ControllerBase {
    private readonly TravelDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ToursController(TravelDbContext context, IWebHostEnvironment env) {
        _context = context;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var tours = await _context.Tours
            .Include(t => t.Category)
            .Include(t => t.TourImages)
            .Select(t => new {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                t.CategoryId,
                CategoryName = t.Category != null ? t.Category.Name : "Chưa phân loại",
                Thumbnail = t.TourImages.Where(img => img.IsPrimary).Select(img => img.ImageUrl).FirstOrDefault(),
                MinPrice = t.TourSchedules.Any() ? t.TourSchedules.Min(s => s.AdultPrice) : 0
            })
            .ToListAsync();
        return Ok(tours);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] TourDto tourDto, IFormFile? imageFile) {
        try {
            var tour = new Tour {
                Name = tourDto.Name,
                Code = tourDto.Code,
                DepartureLocation = tourDto.DepartureLocation,
                CategoryId = tourDto.CategoryId,
                Description = tourDto.Description ?? ""
            };
            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();
            if (imageFile != null) await SaveImage(tour.Id, imageFile);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm tour thành công!", id = tour.Id });
        } catch (Exception ex) {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] TourDto tourDto, IFormFile? imageFile) {
        try {
            var tour = await _context.Tours.Include(t => t.TourImages).FirstOrDefaultAsync(t => t.Id == id);
            if (tour == null) return NotFound(new { message = "Không tìm thấy Tour!" });

            tour.Name = tourDto.Name;
            tour.Code = tourDto.Code;
            tour.DepartureLocation = tourDto.DepartureLocation;
            tour.CategoryId = tourDto.CategoryId;
            tour.Description = tourDto.Description ?? "";

            if (imageFile != null) {
                var currentImages = _context.TourImages.Where(img => img.TourId == id);
                foreach (var img in currentImages) img.IsPrimary = false;
                await SaveImage(id, imageFile);
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật tour thành công!" });
        } catch (Exception ex) {
            return BadRequest(new { message = ex.Message });
        }
    }

    // --- HÀM DELETE ĐÃ ĐƯỢC FIX LỖI 500 ---
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        try {
            var tour = await _context.Tours
                .Include(t => t.TourImages)
                .Include(t => t.TourSchedules) // Nếu có bảng lịch trình, hãy include vào
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tour == null) return NotFound(new { message = "Không tìm thấy tour để xóa" });

            // 1. Xóa các ảnh liên quan trong Database
            if (tour.TourImages.Any()) {
                _context.TourImages.RemoveRange(tour.TourImages);
            }

            // 2. Xóa các lịch trình liên quan (nếu có)
            if (tour.TourSchedules.Any()) {
                _context.TourSchedules.RemoveRange(tour.TourSchedules);
            }

            // 3. Xóa chính cái Tour
            _context.Tours.Remove(tour);
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa tour thành công" });
        } catch (Exception ex) {
            // Log lỗi chi tiết để Leader xem ở Terminal
            Console.WriteLine("LỖI XÓA TOUR: " + ex.Message);
            return StatusCode(500, new { message = "Không thể xóa tour vì có dữ liệu liên quan (lịch trình hoặc đặt chỗ).", detail = ex.Message });
        }
    }

    private async Task SaveImage(int tourId, IFormFile file) {
        string rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        string uploadsFolder = Path.Combine(rootPath, "uploads");
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        string filePath = Path.Combine(uploadsFolder, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create)) {
            await file.CopyToAsync(stream);
        }

        var tourImage = new TourImage { TourId = tourId, ImageUrl = $"/uploads/{fileName}", IsPrimary = true };
        _context.TourImages.Add(tourImage);
    }
}

public class TourDto {
    public string Name { get; set; } = "";
    public string Code { get; set; } = "";
    public string DepartureLocation { get; set; } = "";
    public int CategoryId { get; set; }
    public string? Description { get; set; }
}