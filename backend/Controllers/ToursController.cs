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

    // ==========================================
    // 1. LẤY DANH SÁCH TOUR (Cho trang chủ/Danh sách)
    // ==========================================
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() {
        try {
            // Lấy dữ liệu thô từ DB về RAM để xử lý, tránh lỗi dịch SQL phức tạp
            var toursData = await _context.Tours
                .Include(t => t.Category)
                .Include(t => t.TourSchedules)
                .ToListAsync();

            // Mapping dữ liệu sang định dạng JSON gọn nhẹ
            var result = toursData.Select(t => new {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                t.CategoryId,
                CategoryName = t.Category?.Name ?? "Chưa phân loại",
                Thumbnail = !string.IsNullOrEmpty(t.ImageUrl) 
                            ? t.ImageUrl 
                            : "/uploads/tours/default.jpg",
                
                // Lấy giá người lớn của lịch trình gần nhất (dùng làm giá hiển thị)
                AdultPrice = t.TourSchedules
                                .OrderBy(s => s.DepartureDate)
                                .FirstOrDefault()?.AdultPrice ?? 0,
                
                ChildPrice = t.TourSchedules
                                .OrderBy(s => s.DepartureDate)
                                .FirstOrDefault()?.ChildPrice ?? 0
            }).ToList();

            return Ok(result);
        } catch (Exception ex) {
            return BadRequest(new { message = "Lỗi hệ thống: " + ex.Message });
        }
    }

    // ==========================================
    // 2. LẤY CHI TIẾT 1 TOUR (Cho trang TourDetail)
    // ==========================================
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id) {
        var tour = await _context.Tours
            .Include(t => t.Category)
            .Include(t => t.TourImages)    // Lấy gallery ảnh phụ
            .Include(t => t.TourSchedules) // Lấy các ngày khởi hành và giá
            .Include(t => t.Reviews)       // Lấy danh sách đánh giá
                .ThenInclude(r => r.User)  // Lấy thông tin người đánh giá
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tour == null) return NotFound(new { message = "Không tìm thấy tour này!" });

        return Ok(tour);
    }

    // ==========================================
    // 3. TẠO MỚI TOUR (Admin)
    // ==========================================
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

            if (tourDto.ImageFile != null) {
                tour.ImageUrl = await UploadProcess(tourDto.ImageFile);
            }
            
            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            // Tạo ngay 1 lịch trình mặc định để tour có giá hiển thị
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
            return Ok(new { message = "Thêm tour thành công!", id = tour.Id });
        } catch (Exception ex) {
            return BadRequest(new { message = "Lỗi khi tạo: " + ex.Message });
        }
    }

    // ==========================================
    // 4. CẬP NHẬT TOUR (Admin)
    // ==========================================
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

            if (tourDto.ImageFile != null) {
                DeleteOldImage(tour.ImageUrl); // Xóa ảnh cũ trên server
                tour.ImageUrl = await UploadProcess(tourDto.ImageFile);
            }

            // Cập nhật giá vào lịch trình đầu tiên để đồng bộ
            var schedule = await _context.TourSchedules.FirstOrDefaultAsync(s => s.TourId == id);
            if (schedule != null) {
                schedule.AdultPrice = tourDto.AdultPrice;
                schedule.ChildPrice = tourDto.ChildPrice;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!" });
        } catch (Exception ex) {
            return BadRequest(new { message = "Lỗi khi cập nhật: " + ex.Message });
        }
    }

    // ==========================================
    // 5. XÓA TOUR (Admin)
    // ==========================================
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) {
        var tour = await _context.Tours.FindAsync(id);
        if (tour == null) return NotFound();

        DeleteOldImage(tour.ImageUrl);
        _context.Tours.Remove(tour);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa tour!" });
    }

    // --- Hàm xử lý File ---

    private async Task<string> UploadProcess(IFormFile file) {
        string rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        string folder = Path.Combine(rootPath, "uploads", "tours");
        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

        string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        string filePath = Path.Combine(folder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create)) {
            await file.CopyToAsync(stream);
        }
        return $"/uploads/tours/{fileName}";
    }

    private void DeleteOldImage(string? imageUrl) {
        if (string.IsNullOrEmpty(imageUrl) || imageUrl.Contains("default.jpg")) return;
        string rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        string fullPath = Path.Combine(rootPath, imageUrl.TrimStart('/'));
        if (System.IO.File.Exists(fullPath)) System.IO.File.Delete(fullPath);
    }
}

// DTO để khớp với Form-data từ Frontend
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