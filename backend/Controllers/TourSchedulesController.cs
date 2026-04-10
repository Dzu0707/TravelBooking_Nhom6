using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TourSchedulesController : ControllerBase
{
    private readonly TravelDbContext _context;
    public TourSchedulesController(TravelDbContext context) => _context = context;

    // 1. GET ALL
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var schedules = await _context.TourSchedules
            .Include(s => s.Tour)
            .OrderByDescending(s => s.DepartureDate)
            .Select(s => new {
                s.Id,
                s.TourId,
                TourName = s.Tour != null ? s.Tour.Name : "N/A",
                s.DepartureDate,
                s.ReturnDate,
                s.AdultPrice,
                s.ChildPrice,
                s.Quota,
                s.AvailableSeats,
                s.Status
            })
            .ToListAsync();
        return Ok(schedules);
    }

    // 1.1 GET BY TOUR ID (Sửa lỗi 404 ở Frontend)
    [HttpGet("by-tour/{tourId}")]
    public async Task<IActionResult> GetByTour(int tourId)
    {
        var schedules = await _context.TourSchedules
            .Where(s => s.TourId == tourId)
            .Include(s => s.Tour)
            .OrderByDescending(s => s.DepartureDate)
            .Select(s => new {
                s.Id,
                s.TourId,
                TourName = s.Tour != null ? s.Tour.Name : "N/A",
                s.DepartureDate,
                s.ReturnDate,
                s.AdultPrice,
                s.ChildPrice,
                s.Quota,
                s.AvailableSeats,
                s.Status
            })
            .ToListAsync();
        return Ok(schedules);
    }

    // 2. POST: Tạo lịch trình mới (Sửa lỗi 400)
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TourSchedule model)
    {
        // Loại bỏ kiểm tra object Tour lồng bên trong để tránh lỗi 400
        ModelState.Remove("Tour");
        
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (model.TourId <= 0) return BadRequest("Vui lòng chọn một Tour hợp lệ.");

        model.AvailableSeats = model.Quota;
        model.Status = "Available";

        _context.TourSchedules.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    // 3. PUT: Cập nhật lịch trình
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TourSchedule model)
    {
        ModelState.Remove("Tour");
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var existing = await _context.TourSchedules.FindAsync(id);
        if (existing == null) return NotFound("Không tìm thấy lịch trình cần sửa.");

        existing.DepartureDate = model.DepartureDate;
        existing.ReturnDate = model.ReturnDate;
        existing.AdultPrice = model.AdultPrice;
        existing.ChildPrice = model.ChildPrice;
        
        int diff = model.Quota - existing.Quota;
        existing.Quota = model.Quota;
        existing.AvailableSeats += diff; 

        existing.Status = model.Status;

        try {
            await _context.SaveChangesAsync();
            return Ok(existing);
        } catch (DbUpdateConcurrencyException) {
            return StatusCode(500, "Lỗi xung đột dữ liệu.");
        }
    }

    // 4. DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var schedule = await _context.TourSchedules.FindAsync(id);
        if (schedule == null) return NotFound();

        var hasBookings = await _context.Bookings.AnyAsync(b => b.TourScheduleId == id);
        if (hasBookings) 
            return BadRequest("Lịch trình này đã có khách đặt chỗ, không thể xóa.");

        _context.TourSchedules.Remove(schedule);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa thành công lịch trình." });
    }
}