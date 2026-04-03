using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")] // Bảo vệ toàn bộ Controller
public class AdminToursController : ControllerBase
{
    private readonly TravelDbContext _context;

    public AdminToursController(TravelDbContext context)
    {
        _context = context;
    }

    // 1. GET: Lấy toàn bộ danh sách
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tours = await _context.Tours
            .Include(t => t.Category)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new {
                t.Id,
                t.Name,
                t.Code,
                CategoryName = t.Category != null ? t.Category.Name : "Không xác định",
                t.DepartureLocation,
                t.CreatedAt
            })
            .ToListAsync();
        return Ok(tours);
    }

    // 2. GET: Lấy chi tiết một Tour theo ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tour = await _context.Tours.FindAsync(id);
        if (tour == null) return NotFound(new { message = "Không tìm thấy tour" });
        return Ok(tour);
    }

    // 3. POST: Thêm mới Tour
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Tour model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        model.CreatedAt = DateTime.Now;
        _context.Tours.Add(model);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Thêm tour mới thành công!", id = model.Id });
    }

    // 4. PUT: Cập nhật thông tin Tour
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Tour model)
    {
        var tour = await _context.Tours.FindAsync(id);
        if (tour == null) return NotFound();

        // Cập nhật các trường dữ liệu
        tour.Name = model.Name;
        tour.Code = model.Code;
        tour.Description = model.Description;
        tour.DepartureLocation = model.DepartureLocation;
        tour.CategoryId = model.CategoryId;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật tour thành công!" });
    }

    // 5. DELETE: Xóa Tour
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var tour = await _context.Tours.FindAsync(id);
        if (tour == null) return NotFound();

        // Lưu ý: Nếu tour đã có Booking hoặc TourSchedules, có thể gây lỗi khóa ngoại
        // Bạn nên xóa các thành phần liên quan hoặc ẩn tour đi (Soft Delete)
        _context.Tours.Remove(tour);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Đã xóa tour khỏi hệ thống" });
    }
}