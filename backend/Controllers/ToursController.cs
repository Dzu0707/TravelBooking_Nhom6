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

    // GET: Lấy tất cả thông tin gộp (Tour + Category + Tất cả Schedules)
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() {
        var tours = await _context.Tours
            .Include(t => t.Category)
            .Include(t => t.TourImages)
            .Include(t => t.TourSchedules)
            .Select(t => new {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                t.CategoryId,
                CategoryName = t.Category != null ? t.Category.Name : "Chưa phân loại",
                Thumbnail = t.TourImages.Where(img => img.IsPrimary)
                            .Select(img => "http://localhost:5091" + img.ImageUrl)
                            .FirstOrDefault() ?? "http://localhost:5091/uploads/default.jpg",
                
                // Lấy giá mặc định từ lịch trình sớm nhất để hiển thị ở bảng Tour
                AdultPrice = t.TourSchedules.OrderBy(s => s.DepartureDate).Select(s => s.AdultPrice).FirstOrDefault(),
                ChildPrice = t.TourSchedules.OrderBy(s => s.DepartureDate).Select(s => s.ChildPrice).FirstOrDefault(),

                Schedules = t.TourSchedules.OrderBy(s => s.DepartureDate).Select(s => new {
                    s.Id,
                    s.DepartureDate,
                    s.ReturnDate,
                    s.AdultPrice,
                    s.ChildPrice,
                    s.AvailableSeats,
                    s.Quota,
                    s.Status
                }).ToList(),
                
                MinPrice = t.TourSchedules.Any() ? t.TourSchedules.Min(s => s.AdultPrice) : 0
            })
            .ToListAsync();
        return Ok(tours);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
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

            // Tạo 1 lịch trình mặc định dựa trên giá nhập từ TourDto
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

            if (imageFile != null) await SaveImage(tour.Id, imageFile);
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm thành công!", id = tour.Id });
        } catch (Exception ex) {
            return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromForm] TourDto tourDto, IFormFile? imageFile) {
        try {
            var tour = await _context.Tours
                .Include(t => t.TourImages)
                .Include(t => t.TourSchedules)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tour == null) return NotFound();

            tour.Name = tourDto.Name;
            tour.Code = tourDto.Code;
            tour.DepartureLocation = tourDto.DepartureLocation;
            tour.CategoryId = tourDto.CategoryId;
            tour.Description = tourDto.Description ?? "";

            // Cập nhật giá cho các lịch trình hiện có (hoặc chỉ lịch trình đầu tiên)
            var firstSchedule = tour.TourSchedules.OrderBy(s => s.DepartureDate).FirstOrDefault();
            if (firstSchedule != null) {
                firstSchedule.AdultPrice = tourDto.AdultPrice;
                firstSchedule.ChildPrice = tourDto.ChildPrice;
            }

            if (imageFile != null) {
                var oldPrimary = tour.TourImages.FirstOrDefault(img => img.IsPrimary);
                if (oldPrimary != null) oldPrimary.IsPrimary = false;
                await SaveImage(id, imageFile);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!" });
        } catch (Exception ex) {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) {
        try {
            var tour = await _context.Tours
                .Include(t => t.TourImages)
                .Include(t => t.TourSchedules)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tour == null) return NotFound();

            foreach(var img in tour.TourImages) {
                string filePath = Path.Combine(_env.WebRootPath ?? "wwwroot", img.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
            }

            _context.TourSchedules.RemoveRange(tour.TourSchedules);
            _context.TourImages.RemoveRange(tour.TourImages);
            _context.Tours.Remove(tour);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa sạch toàn bộ dữ liệu liên quan!" });
        } catch (Exception ex) {
            return StatusCode(500, new { message = "Lỗi: " + ex.Message });
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
        _context.TourImages.Add(new TourImage { TourId = tourId, ImageUrl = $"/uploads/{fileName}", IsPrimary = true });
    }
}

public class TourDto {
    public string Name { get; set; } = "";
    public string Code { get; set; } = "";
    public string DepartureLocation { get; set; } = "";
    public int CategoryId { get; set; }
    public string? Description { get; set; }
    public decimal AdultPrice { get; set; } 
    public decimal ChildPrice { get; set; }
}