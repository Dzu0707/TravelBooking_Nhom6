using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ToursController : ControllerBase {
    private readonly TravelDbContext _context;
    public ToursController(TravelDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var tours = await _context.Tours
            .Include(t => t.Category) // Cần Include để lấy tên danh mục từ bảng Category
            .Include(t => t.TourImages) // Cần để lấy ảnh đại diện của Tour
            .Select(t => new {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                CategoryName = t.Category != null ? t.Category.Name : "Chưa phân loại",
                // Lấy ảnh IsPrimary (Ảnh chính) để hiện ở trang danh sách
                Thumbnail = t.TourImages.Where(img => img.IsPrimary).Select(img => img.ImageUrl).FirstOrDefault(),
                
                // Lấy giá thấp nhất từ các Schedule để hiển thị "Giá chỉ từ..."
                MinPrice = t.TourSchedules.Any() ? t.TourSchedules.Min(s => s.AdultPrice) : 0,

                Schedules = t.TourSchedules.Select(s => new {
                    s.Id,
                    s.DepartureDate,
                    s.ReturnDate, // Thêm ngày về theo ERD
                    s.AdultPrice,
                    s.ChildPrice,  // Thêm giá trẻ em theo ERD
                    s.AvailableSeats
                }).ToList()
            })
            .ToListAsync();

        return Ok(tours);
    }
}