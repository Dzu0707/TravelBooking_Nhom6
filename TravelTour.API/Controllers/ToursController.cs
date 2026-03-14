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
            .Select(t => new {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                t.Description,
                // Chỉ lấy những thông tin cần thiết từ Schedule, tránh lôi cả object Tour ngược lại
                Schedules = t.TourSchedules.Select(s => new {
                    s.Id,
                    s.DepartureDate,
                    s.AdultPrice,
                    s.AvailableSeats
                }).ToList()
            })
            .ToListAsync();

        return Ok(tours);
    }
}