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

        // 1. LẤY TOÀN BỘ BOOKINGS (Dành cho Admin Dashboard)
        [HttpGet]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới được lấy hết
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User) // Lấy thông tin khách hàng
                .Include(b => b.TourSchedule)
                    .ThenInclude(s => s!.Tour) // Lấy thông tin Tour
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(bookings);
        }

        // 2. TẠO BOOKING MỚI
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