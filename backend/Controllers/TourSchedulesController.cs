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

    // GET: api/TourSchedules/Tour/5 (Lấy tất cả lịch trình của 1 tour)
    [HttpGet("Tour/{tourId}")]
    public async Task<IActionResult> GetSchedulesByTour(int tourId)
    {
        var schedules = await _context.TourSchedules
            .Where(s => s.TourId == tourId)
            .ToListAsync();
        return Ok(schedules);
    }

    // POST: api/TourSchedules (Tạo lịch trình mới)
    [HttpPost]
    public async Task<IActionResult> Create(TourSchedule model)
    {
        _context.TourSchedules.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }
}