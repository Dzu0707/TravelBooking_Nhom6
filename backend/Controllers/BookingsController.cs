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

        // 1. LẤY TOÀN BỘ BOOKINGS (Admin)
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
                        b.ContactName,
                        b.ContactEmail,
                        b.ContactPhone,
                        b.SpecialRequest,
                        b.AdultCount,
                        b.ChildCount,
                        OrderCode = $"PAYTOUR{b.Id}{PAYMENT_SUFFIX}",
                        StartDate = b.TourSchedule != null ? b.TourSchedule.DepartureDate : (DateTime?)null,
                        CustomerName = !string.IsNullOrEmpty(b.ContactName) ? b.ContactName : (b.User != null ? b.User.FullName : "Khách ẩn danh"),
                        CustomerEmail = !string.IsNullOrEmpty(b.ContactEmail) ? b.ContactEmail : (b.User != null ? b.User.Email : "N/A"),
                        TourName = b.TourSchedule != null && b.TourSchedule.Tour != null
                            ? b.TourSchedule.Tour.Name
                            : "Tour không xác định"
                    })
                    .ToListAsync();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi Server: {ex.Message}");
            }
        }

        // 2. TẠO BOOKING MỚI - FIX LOGIC TRỪ VOUCHER
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
            if (request == null) return BadRequest("Dữ liệu yêu cầu không hợp lệ.");

            // Dùng Transaction để đảm bảo nếu trừ voucher lỗi thì không tạo đơn hàng
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Phiên đăng nhập hết hạn.");
                int userId = int.Parse(userIdClaim);

                // Kiểm tra lịch trình
                var schedule = await _context.TourSchedules
                    .FirstOrDefaultAsync(s => s.Id == request.TourScheduleId);
                
                if (schedule == null) return BadRequest("Lịch trình không tồn tại.");

                if (schedule.Status == "Inactive" || schedule.Status == "Full" || schedule.AvailableSeats <= 0)
                {
                    return BadRequest("Rất tiếc, tour đã hết chỗ.");
                }

                if (schedule.AvailableSeats < request.TotalPassengers)
                {
                    return BadRequest($"Chỉ còn {schedule.AvailableSeats} chỗ trống.");
                }

                // --- LOGIC TRỪ VOUCHER (ĐÃ FIX) ---
                if (!string.IsNullOrEmpty(request.VoucherCode))
                {
                    // Tìm voucher trong DB (viết hoa mã để so sánh chính xác)
                    var voucherInDb = await _context.Vouchers
                        .Where(v => v.Code == request.VoucherCode.Trim().ToUpper())
                        .FirstOrDefaultAsync();

                    if (voucherInDb != null)
                    {
                        if (voucherInDb.Quantity > 0)
                        {
                            // Trừ số lượng ngay lập tức
                            voucherInDb.Quantity = voucherInDb.Quantity - 1;
                            
                            // Đánh dấu là đã thay đổi
                            _context.Entry(voucherInDb).State = EntityState.Modified;
                        }
                        else
                        {
                            return BadRequest("Mã giảm giá này đã hết lượt sử dụng.");
                        }
                    }
                    else 
                    {
                        // Nếu khách nhập mã mà không tìm thấy trong DB
                        return BadRequest("Mã giảm giá không hợp lệ.");
                    }
                }

                // Tạo Booking
                var newBooking = new Booking
                {
                    UserId = userId,
                    TourScheduleId = request.TourScheduleId,
                    TotalPassengers = request.TotalPassengers,
                    TotalPrice = request.TotalPrice,
                    Status = "Pending",
                    CreatedAt = DateTime.Now,
                    ContactName = (request.FullName ?? "").Trim(),
                    ContactEmail = (request.Email ?? "").Trim(),
                    ContactPhone = (request.Phone ?? "").Trim(),
                    SpecialRequest = request.Note,
                    AdultCount = request.AdultCount,
                    ChildCount = request.ChildCount
                };

                // Cập nhật số chỗ trống của Tour
                schedule.AvailableSeats -= request.TotalPassengers;
                if (schedule.AvailableSeats <= 0) 
                {
                    schedule.AvailableSeats = 0;
                    schedule.Status = "Inactive"; 
                }

                _context.Bookings.Add(newBooking);
                
                // Lưu tất cả thay đổi (bao gồm cả Voucher và Booking)
                await _context.SaveChangesAsync();

                // Tạo Transaction
                var newTransaction = new Transaction
                {
                    BookingId = newBooking.Id,
                    TransactionCode = $"PAYTOUR{newBooking.Id}{PAYMENT_SUFFIX}",
                    Amount = newBooking.TotalPrice,
                    PaymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? "cod" : request.PaymentMethod.ToLower(),
                    Status = (request.PaymentMethod?.ToLower() == "online") ? "Pending" : "Unpaid",
                    CreatedAt = DateTime.Now
                };

                _context.Transactions.Add(newTransaction);
                await _context.SaveChangesAsync();
                
                // Xác nhận hoàn tất transaction
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Đặt tour thành công và đã áp dụng mã giảm giá!",
                    bookingId = newBooking.Id,
                    orderCode = newTransaction.TransactionCode
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Lỗi: {ex.Message}");
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
                        b.ContactName,
                        b.ContactEmail,
                        b.ContactPhone,
                        b.AdultCount,
                        b.ChildCount,
                        OrderCode = $"PAYTOUR{b.Id}{PAYMENT_SUFFIX}",
                        StartDate = b.TourSchedule != null ? b.TourSchedule.DepartureDate : (DateTime?)null,
                        DepartureLocation = b.TourSchedule != null && b.TourSchedule.Tour != null
                            ? b.TourSchedule.Tour.DepartureLocation
                            : "TP. Hồ Chí Minh",
                        TourName = b.TourSchedule != null && b.TourSchedule.Tour != null
                            ? b.TourSchedule.Tour.Name
                            : "Tour không xác định"
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
                var booking = await _context.Bookings
                    .Include(b => b.Transactions)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (booking == null) return NotFound("Không tìm thấy đơn hàng.");
                if (booking.Status == "Cancelled") return BadRequest("Đơn hàng đã bị hủy.");
                
                booking.Status = "Confirmed";

                var latestTransaction = booking.Transactions
                    .OrderByDescending(t => t.CreatedAt)
                    .FirstOrDefault();

                if (latestTransaction != null)
                {
                    latestTransaction.Status = "Paid";
                }

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
                    if (booking.TourSchedule.Status == "Inactive" || booking.TourSchedule.Status == "Full") 
                    {
                        booking.TourSchedule.Status = "Active";
                    }
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
            public string FullName { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Phone { get; set; } = string.Empty;
            public string? Note { get; set; }
            public int AdultCount { get; set; }
            public int ChildCount { get; set; }
            public string? PaymentMethod { get; set; }
            public string? VoucherCode { get; set; }
        }
    }
}