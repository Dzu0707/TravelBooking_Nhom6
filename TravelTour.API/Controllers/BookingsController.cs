using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace TravelTour.API.Controllers
{
    [Authorize] // Bắt buộc đăng nhập mới được đặt tour
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
                // 1. Lấy Email từ JWT Token để xác định ai đang đặt hàng
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized("Không tìm thấy thông tin người dùng trong Token.");
                }

                // 2. Tìm User trong Database
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null)
                {
                    return NotFound("Người dùng không tồn tại trong hệ thống.");
                }

                // 3. Kiểm tra xem Lịch trình tour (TourSchedule) có tồn tại không
                var schedule = await _context.TourSchedules.FindAsync(request.TourScheduleId);
                if (schedule == null)
                {
                    return BadRequest("Lịch trình tour không hợp lệ.");
                }

                // 4. Tạo bản ghi Booking mới (Khớp với ERD của bạn)
                var newBooking = new Booking
                {
                    UserId = user.Id,
                    TourScheduleId = request.TourScheduleId,
                    TotalPassengers = request.TotalPassengers,
                    TotalPrice = request.TotalPrice,
                    Status = "Pending", // Trạng thái mặc định: Chờ xử lý
                    CreatedAt = DateTime.Now
                };

                // 5. Lưu vào Database
                _context.Bookings.Add(newBooking);
                await _context.SaveChangesAsync();

                // Trả về kết quả thành công
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

        // GET: api/Bookings/my-bookings (Để demo danh sách đơn hàng đã mua)
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            // 1. Lấy Email và kiểm tra null ngay lập tức
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail)) return Unauthorized("Token không lệ.");

            // 2. Tìm User
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            
            // Kiểm tra nếu user null thì dừng lại, không chạy tiếp xuống dòng 88
            if (user == null) return Unauthorized("Người dùng không tồn tại.");

            // 3. Truy vấn (Dòng 88 nằm ở đây)
            var myBookings = await _context.Bookings
                .Include(b => b.TourSchedule)
                    .ThenInclude(s => s != null ? s.Tour : null) // Kiểm tra null cho quan hệ
                .Where(b => b.UserId == user.Id) // Bây giờ user.Id đã an toàn 100%
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(myBookings);
        }
    }

    // DTO (Data Transfer Object) để nhận dữ liệu từ React gửi lên
    public class BookingRequest
    {
        public int TourScheduleId { get; set; }
        public int TotalPassengers { get; set; }
        public decimal TotalPrice { get; set; }
    }
}