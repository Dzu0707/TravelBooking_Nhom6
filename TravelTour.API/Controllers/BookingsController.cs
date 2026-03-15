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

        // POST: api/Bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
            try
            {
                // 1. Lấy Email từ JWT Token
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized("Không tìm thấy thông tin người dùng trong Token.");
                }

                // 2. Tìm User
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null)
                {
                    return NotFound("Người dùng không tồn tại.");
                }

                // 3. Kiểm tra TourSchedule
                var schedule = await _context.TourSchedules.FindAsync(request.TourScheduleId);
                if (schedule == null)
                {
                    return BadRequest("Lịch trình tour không hợp lệ.");
                }

                // 4. Kiểm tra số lượng chỗ (Dựa theo ERD: AvailableSeats)
                if (schedule.AvailableSeats < request.TotalPassengers)
                {
                    return BadRequest("Số lượng chỗ còn lại không đủ.");
                }

                // 5. Tạo Booking
                var newBooking = new Booking
                {
                    UserId = user.Id,
                    TourScheduleId = request.TourScheduleId,
                    TotalPassengers = request.TotalPassengers,
                    TotalPrice = request.TotalPrice,
                    Status = "Pending",
                    CreatedAt = DateTime.Now
                };

                // Cập nhật số chỗ còn lại (AvailableSeats)
                schedule.AvailableSeats -= request.TotalPassengers;

                _context.Bookings.Add(newBooking);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Đặt tour thành công!", 
                    bookingId = newBooking.Id,
                    totalAmount = newBooking.TotalPrice 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // GET: api/Bookings/my-bookings
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            // 1. Lấy Email từ Token
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail)) return Unauthorized("Token không hợp lệ.");

            // 2. Tìm User
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            
            // Kiểm tra null cực kỳ quan trọng để fix CS8602
            if (user == null) return NotFound("Người dùng không tồn tại.");

            // 3. Truy vấn danh sách Booking
            var myBookings = await _context.Bookings
                .Include(b => b.TourSchedule)
                    .ThenInclude(s => s!.Tour) // Dùng dấu ! (null-forgiving) vì chúng ta biết Schedule phải có Tour
                .Where(b => b.UserId == user.Id) // Bây giờ user.Id đã an toàn
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