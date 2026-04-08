using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;
using Microsoft.AspNetCore.Authorization;

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

    // GET: api/tours
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() {
        var tours = await _context.Tours
            .Include(t => t.Category)
            .Include(t => t.TourSchedules)
            .Select(t => new {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                t.CategoryId,
                t.Description,
                CategoryName = t.Category != null ? t.Category.Name : "Chưa phân loại",
                // Trả về đường dẫn tương đối, React sẽ tự nối Domain để linh hoạt hơn
                Thumbnail = !string.IsNullOrEmpty(t.ImageUrl) 
                            ? t.ImageUrl 
                            : "/uploads/tours/default.jpg",
                
                // Lấy giá từ lịch trình gần nhất
                AdultPrice = t.TourSchedules.OrderBy(s => s.DepartureDate).Select(s => s.AdultPrice).FirstOrDefault(),
                ChildPrice = t.TourSchedules.OrderBy(s => s.DepartureDate).Select(s => s.ChildPrice).FirstOrDefault()
            })
            .ToListAsync();
        return Ok(tours);
    }

    // POST: api/tours
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] TourDto tourDto) {
        try {
            var tour = new Tour {
                Name = tourDto.Name,
                Code = tourDto.Code,
                DepartureLocation = tourDto.DepartureLocation,
                CategoryId = tourDto.CategoryId,
                Description = tourDto.Description ?? "",
                CreatedAt = DateTime.Now
            };

            // Xử lý Upload ảnh nếu có
            if (tourDto.ImageFile != null) {
                tour.ImageUrl = await UploadProcess(tourDto.ImageFile);
            }
            
            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            // Tự động tạo 1 lịch trình (Schedule) mặc định để Tour có giá hiển thị
            var schedule = new TourSchedule {
                TourId = tour.Id,
                AdultPrice = tourDto.AdultPrice,
                ChildPrice = tourDto.ChildPrice,
                DepartureDate = DateTime.Now.AddDays(7),
                ReturnDate = DateTime.Now.AddDays(10),
                Quota = 20,
                AvailableSeats = 20,
                Status = "Available"
            };
            _context.TourSchedules.Add(schedule);
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm tour mới thành công!", id = tour.Id });
        } catch (Exception ex) {
            return BadRequest(new { message = "Lỗi khi tạo tour: " + ex.Message });
        }
    }

    // PUT: api/tours/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromForm] TourDto tourDto) {
        try {
            var tour = await _context.Tours.FirstOrDefaultAsync(t => t.Id == id);
            if (tour == null) return NotFound(new { message = "Không tìm thấy tour!" });

            tour.Name = tourDto.Name;
            tour.Code = tourDto.Code;
            tour.DepartureLocation = tourDto.DepartureLocation;
            tour.CategoryId = tourDto.CategoryId;
            tour.Description = tourDto.Description ?? "";

            // Nếu có ảnh mới gửi lên
            if (tourDto.ImageFile != null) {
                // Xóa ảnh cũ để tiết kiệm bộ nhớ server
                DeleteOldImage(tour.ImageUrl);
                // Lưu ảnh mới
                tour.ImageUrl = await UploadProcess(tourDto.ImageFile);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật tour thành công!" });
        } catch (Exception ex) {
            return BadRequest(new { message = "Lỗi khi cập nhật: " + ex.Message });
        }
    }

    // DELETE: api/tours/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) {
        var tour = await _context.Tours.FindAsync(id);
        if (tour == null) return NotFound();

        DeleteOldImage(tour.ImageUrl);
        _context.Tours.Remove(tour);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa tour thành công!" });
    }

    // --- Helper Methods ---

    private async Task<string> UploadProcess(IFormFile file) {
        // Lấy đường dẫn thư mục wwwroot
        string rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        string uploadsFolder = Path.Combine(rootPath, "uploads", "tours");
        
        if (!Directory.Exists(uploadsFolder)) 
            Directory.CreateDirectory(uploadsFolder);

        // Tạo tên file duy nhất tránh trùng lặp
        string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        string filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create)) {
            await file.CopyToAsync(stream);
        }

        // Trả về đường dẫn để lưu vào DB (bắt đầu bằng dấu /)
        return $"/uploads/tours/{fileName}";
    }

    private void DeleteOldImage(string? imageUrl) {
        if (string.IsNullOrEmpty(imageUrl) || imageUrl.Contains("default.jpg")) return;
        
        string rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        string fullPath = Path.Combine(rootPath, imageUrl.TrimStart('/'));
        
        if (System.IO.File.Exists(fullPath)) {
            System.IO.File.Delete(fullPath);
        }
    }
}

// Data Transfer Object (DTO)
public class TourDto {
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string DepartureLocation { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string? Description { get; set; }
    public decimal AdultPrice { get; set; } 
    public decimal ChildPrice { get; set; }
    public IFormFile? ImageFile { get; set; } 
}