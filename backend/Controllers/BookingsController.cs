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
        private const string PAYMENT_SUFFIX = "NHOM6"; 

        public BookingsController(TravelDbContext context)
        {
            _context = context;
        }

        // 1. LẤY TOÀN BỘ BOOKINGS
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
                        // FIX: Xóa b.PaymentMethod vì model chưa có, thay bằng mặc định
                        PaymentMethod = "Chuyển khoản", 
                        OrderCode = $"PAYTOUR{b.Id}{PAYMENT_SUFFIX}", 
                        CustomerName = b.User != null ? b.User.FullName : "Khách ẩn danh",
                        CustomerEmail = b.User != null ? b.User.Email : "N/A",
                        // FIX: Thay b.User.PhoneNumber bằng chuỗi trống hoặc N/A
                        CustomerPhone = "N/A", 
                        
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

        // 2. TẠO BOOKING MỚI
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Phiên đăng nhập hết hạn.");

                int userId = int.Parse(userIdClaim);

                var schedule = await _context.TourSchedules
                    .FirstOrDefaultAsync(s => s.Id == request.TourScheduleId);
                
                if (schedule == null) return BadRequest("Lịch trình không tồn tại.");

                if (schedule.AvailableSeats < request.TotalPassengers)
                    return BadRequest($"Rất tiếc, tour này hiện chỉ còn {schedule.AvailableSeats} chỗ trống.");

                var newBooking = new Booking
                {
                    UserId = userId,
                    TourScheduleId = request.TourScheduleId,
                    TotalPassengers = request.TotalPassengers,
                    TotalPrice = request.TotalPrice,
                    // FIX: Bỏ gán PaymentMethod vì model chưa định nghĩa
                    Status = "Pending",
                    CreatedAt = DateTime.Now 
                };

                schedule.AvailableSeats -= request.TotalPassengers;
                if (schedule.AvailableSeats <= 0) schedule.Status = "Full";

                _context.Bookings.Add(newBooking);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { 
                    message = "Đặt tour thành công!", 
                    bookingId = newBooking.Id,
                    orderCode = $"PAYTOUR{newBooking.Id}{PAYMENT_SUFFIX}" 
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // 3. LẤY BOOKINGS CÁ NHÂN
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            try 
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
                        b.TotalPassengers,
                        // FIX: Thay bằng mặc định
                        PaymentMethod = "Chuyển khoản",
                        OrderCode = $"PAYTOUR{b.Id}{PAYMENT_SUFFIX}",
                        StartDate = b.TourSchedule != null ? b.TourSchedule.DepartureDate : (DateTime?)null,
                        DepartureLocation = b.TourSchedule != null && b.TourSchedule.Tour != null 
                                            ? b.TourSchedule.Tour.DepartureLocation : "TP. Hồ Chí Minh",
                        TourName = b.TourSchedule != null && b.TourSchedule.Tour != null 
                                   ? b.TourSchedule.Tour.Name : "Tour không xác định"
                    })
                    .ToListAsync();

                return Ok(myBookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi tải lịch sử: {ex.Message}");
            }
        }

        // 4. XÁC NHẬN THANH TOÁN
        [HttpPut("{id}/confirm-payment")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmPayment(int id)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null) return NotFound("Không tìm thấy đơn hàng.");
                if (booking.Status == "Cancelled") return BadRequest("Đơn hàng đã bị hủy.");
                if (booking.Status == "Confirmed") return BadRequest("Đã thanh toán trước đó.");

                booking.Status = "Confirmed";
                await _context.SaveChangesAsync();
                return Ok(new { message = $"Đã xác nhận thanh toán đơn hàng #{id}" });
            }
            catch (Exception ex) { return StatusCode(500, $"Lỗi: {ex.Message}"); }
        }

        // 5. HỦY ĐƠN HÀNG
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.TourSchedule)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (booking == null) return NotFound("Đơn hàng không tồn tại.");
                
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                if (userRole != "Admin")
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (booking.UserId.ToString() != userIdClaim) return Forbid();
                }

                if (booking.Status == "Cancelled") return BadRequest("Đơn hàng đã hủy từ trước.");

                if (booking.TourSchedule != null)
                {
                    booking.TourSchedule.AvailableSeats += booking.TotalPassengers;
                    if (booking.TourSchedule.Status == "Full") booking.TourSchedule.Status = "Active";
                }

                booking.Status = "Cancelled";
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã hủy đơn hàng." });
            }
            catch (Exception ex) { return StatusCode(500, $"Lỗi: {ex.Message}"); }
        }

        public class BookingRequest
        {
            public int TourScheduleId { get; set; }
            public int TotalPassengers { get; set; }
            public decimal TotalPrice { get; set; }
            public string? PaymentMethod { get; set; }
        }
    }
}