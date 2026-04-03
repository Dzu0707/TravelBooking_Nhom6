using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace TravelTour.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public BookingsController(TravelDbContext context)
        {
            _context = context;
        }

        // 1. LẤY TOÀN BỘ BOOKINGS (Fix lỗi 500 vòng lặp cho Admin Dashboard)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.TourSchedule)
                        .ThenInclude(s => s!.Tour)
                    .OrderByDescending(b => b.CreatedAt)
                    .Select(b => new {
                        b.Id,
                        b.TotalPrice,
                        b.CreatedAt,
                        b.Status,
                        b.TotalPassengers,
                        // Tránh trả về nguyên Object User để không bị vòng lặp JSON
                        CustomerName = b.User != null ? b.User.FullName : "Khách ẩn danh",
                        TourName = b.TourSchedule != null && b.TourSchedule.Tour != null 
                                   ? b.TourSchedule.Tour.Name : "Tour không xác định"
                    })
                    .ToListAsync();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi Server: {ex.Message}");
            }
        }

        // 2. TẠO BOOKING MỚI (Dành cho Khách hàng)
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail)) return Unauthorized("Token không hợp lệ.");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null) return NotFound("Người dùng không tồn tại.");

                var schedule = await _context.TourSchedules.FindAsync(request.TourScheduleId);
                if (schedule == null) return BadRequest("Lịch trình không hợp lệ.");

                if (schedule.AvailableSeats < request.TotalPassengers)
                    return BadRequest("Số lượng chỗ còn lại không đủ.");

                var newBooking = new Booking
                {
                    UserId = user.Id,
                    TourScheduleId = request.TourScheduleId,
                    TotalPassengers = request.TotalPassengers,
                    TotalPrice = request.TotalPrice,
                    Status = "Pending",
                    CreatedAt = DateTime.Now
                };

                // Trừ số chỗ trực tiếp trong DB
                schedule.AvailableSeats -= request.TotalPassengers;

                _context.Bookings.Add(newBooking);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đặt tour thành công!", bookingId = newBooking.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // 3. LẤY BOOKINGS CÁ NHÂN (Dành cho trang Lịch sử của khách)
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound();

            var myBookings = await _context.Bookings
                .Include(b => b.TourSchedule)
                    .ThenInclude(s => s!.Tour)
                .Where(b => b.UserId == user.Id)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new {
                    b.Id,
                    b.TotalPrice,
                    b.CreatedAt,
                    b.Status,
                    TourName = b.TourSchedule != null && b.TourSchedule.Tour != null 
                               ? b.TourSchedule.Tour.Name : "N/A"
                })
                .ToListAsync();

            return Ok(myBookings);
        }
    }

    public class BookingRequest
    {
        public int TourScheduleId { get; set; }
        public int TotalPassengers { get; set; }
        public decimal TotalPrice { get; set; }
    }
}