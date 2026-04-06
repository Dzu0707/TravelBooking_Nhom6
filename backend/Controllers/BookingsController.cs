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

        // 1. LẤY TOÀN BỘ BOOKINGS (Dành cho Admin)
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
                        CustomerName = b.User != null ? b.User.FullName : "Khách ẩn danh",
                        CustomerEmail = b.User != null ? b.User.Email : "N/A",
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
                // Lấy UserId trực tiếp từ NameIdentifier (chuẩn JWT hơn là tìm qua Email)
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Phiên đăng nhập hết hạn.");

                int userId = int.Parse(userIdClaim);

                var schedule = await _context.TourSchedules
                    .FirstOrDefaultAsync(s => s.Id == request.TourScheduleId);
                
                if (schedule == null) return BadRequest("Lịch trình không tồn tại.");

                if (schedule.AvailableSeats < request.TotalPassengers)
                    return BadRequest("Rất tiếc, tour này vừa mới hết chỗ.");

                var newBooking = new Booking
                {
                    UserId = userId,
                    TourScheduleId = request.TourScheduleId,
                    TotalPassengers = request.TotalPassengers,
                    TotalPrice = request.TotalPrice,
                    Status = "Pending",
                    CreatedAt = DateTime.Now
                };

                // Trừ số chỗ
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

        // 3. LẤY BOOKINGS CÁ NHÂN
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var myBookings = await _context.Bookings
                .Include(b => b.TourSchedule)
                    .ThenInclude(s => s!.Tour)
                .Where(b => b.UserId == userId)
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

        // 4. CẬP NHẬT TRẠNG THÁI (Admin xử lý)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            // Kiểm tra trạng thái đầu vào hợp lệ
            var allowedStatuses = new[] { "Pending", "Confirmed", "Cancelled" };
            if (!allowedStatuses.Contains(request.Status))
                return BadRequest("Trạng thái không hợp lệ.");

            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.TourSchedule)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (booking == null) return NotFound("Không tìm thấy đơn hàng.");

                // Chỉ xử lý nếu trạng thái thực sự thay đổi
                if (booking.Status != request.Status)
                {
                    // Trường hợp 1: Hủy đơn (Cancelled) -> Hoàn lại chỗ
                    if (request.Status == "Cancelled")
                    {
                        if (booking.TourSchedule != null)
                        {
                            booking.TourSchedule.AvailableSeats += booking.TotalPassengers;
                        }
                    }
                    // Trường hợp 2: Khôi phục từ Cancelled sang trạng thái khác -> Trừ lại chỗ
                    else if (booking.Status == "Cancelled")
                    {
                        if (booking.TourSchedule != null)
                        {
                            if (booking.TourSchedule.AvailableSeats < booking.TotalPassengers)
                                return BadRequest("Không thể khôi phục vì tour đã đầy chỗ.");
                            
                            booking.TourSchedule.AvailableSeats -= booking.TotalPassengers;
                        }
                    }

                    booking.Status = request.Status;
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = $"Đã cập nhật trạng thái đơn hàng #{id} sang {request.Status}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi cập nhật: {ex.Message}");
            }
        }

        // --- DTO Models ---
        public class UpdateStatusRequest
        {
            public string Status { get; set; } = string.Empty;
        }

        public class BookingRequest
        {
            public int TourScheduleId { get; set; }
            public int TotalPassengers { get; set; }
            public decimal TotalPrice { get; set; }
        }
    }
}