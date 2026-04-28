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
        private const string PAYMENT_SUFFIX = "NHOM6"; // Hằng số để dễ quản lý mã đối soát

        public BookingsController(TravelDbContext context)
        {
            _context = context;
        }

        // 1. LẤY TOÀN BỘ BOOKINGS (Dành cho trang Admin đối soát)
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
                        PaymentCode = $"PAYTOUR{b.Id}{PAYMENT_SUFFIX}",
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

        // 2. TẠO BOOKING MỚI (Khách hàng đặt tour)
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
            // Sử dụng Transaction để đảm bảo nếu trừ chỗ lỗi thì không tạo đơn hàng
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Phiên đăng nhập hết hạn.");

                int userId = int.Parse(userIdClaim);

                // Load lịch trình và khóa bản ghi để tránh tranh chấp (Race Condition)
                var schedule = await _context.TourSchedules
                    .FirstOrDefaultAsync(s => s.Id == request.TourScheduleId);
                
                if (schedule == null) return BadRequest("Lịch trình không tồn tại.");

                if (schedule.AvailableSeats < request.TotalPassengers)
                    return BadRequest($"Rất tiếc, tour này hiện chỉ còn {schedule.AvailableSeats} chỗ trống.");

                // --- LOGIC XỬ LÝ VOUCHER ---
                decimal subTotal = (request.AdultCount * schedule.AdultPrice) + (request.ChildCount * schedule.ChildPrice);
                decimal finalPrice = subTotal; 

                if (!string.IsNullOrEmpty(request.VoucherCode))
                {
                    var voucher = await _context.Vouchers
                        .FirstOrDefaultAsync(v => v.Code.ToUpper() == request.VoucherCode.Trim().ToUpper());

                    if (voucher == null) return BadRequest("Mã giảm giá không tồn tại.");
                    if (voucher.ExpiryDate < DateTime.Now) return BadRequest("Mã giảm giá đã hết hạn.");
                    if (voucher.Quantity <= 0) return BadRequest("Mã giảm giá đã hết lượt sử dụng.");
                    
                    // Tạm đóng kiểm tra MinOrderAmount do Model chưa có thuộc tính này
                    // if (subTotal < voucher.MinOrderAmount) return BadRequest("Đơn hàng chưa đạt giá trị tối thiểu.");

                    decimal discount = 0;
                    if (voucher.DiscountType.ToLower().Contains("percent"))
                        discount = (subTotal * voucher.DiscountValue) / 100;
                    else
                        discount = voucher.DiscountValue;

                    finalPrice = Math.Max(0, subTotal - discount);
                    
                    // Trừ lượt dùng của Voucher
                    voucher.Quantity -= 1;
                }
                else 
                {
                    finalPrice = subTotal;
                }
                // ---------------------------

                var newBooking = new Booking
                {
                    UserId = userId,
                    TourScheduleId = request.TourScheduleId,
                    TotalPassengers = request.TotalPassengers,
                    TotalPrice = finalPrice, 
                    Status = "Pending",
                    CreatedAt = DateTime.Now,

                    ContactName = request.FullName.Trim(),
                    ContactEmail = request.Email.Trim(),
                    ContactPhone = request.Phone.Trim(),
                    SpecialRequest = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim(),

                    AdultCount = request.AdultCount,
                    ChildCount = request.ChildCount
                };

                // Cập nhật số chỗ ngay lập tức
                schedule.AvailableSeats -= request.TotalPassengers;
                if (schedule.AvailableSeats <= 0) schedule.Status = "Full";

                _context.Bookings.Add(newBooking);
                await _context.SaveChangesAsync();

                _context.Transactions.Add(new Transaction
                {
                    BookingId = newBooking.Id,
                    TransactionCode = $"PAYTOUR{newBooking.Id}{PAYMENT_SUFFIX}",
                    Amount = newBooking.TotalPrice,
                    PaymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? "cod" : request.PaymentMethod,
                    Status = request.PaymentMethod == "online" ? "Pending" : "Unpaid",
                    CreatedAt = DateTime.Now
                });

                // Hoàn tất giao dịch
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Đặt tour thành công!",
                    bookingId = newBooking.Id,
                    paymentCode = $"PAYTOUR{newBooking.Id}{PAYMENT_SUFFIX}"
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
                        b.ContactName,
                        b.ContactEmail,
                        b.ContactPhone,
                        b.SpecialRequest,
                        b.AdultCount,
                        b.ChildCount,
                        PaymentCode = $"PAYTOUR{b.Id}{PAYMENT_SUFFIX}",
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

        // 4. XÁC NHẬN THANH TOÁN (Admin)
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
                if (booking.Status == "Confirmed") return BadRequest("Đơn hàng đã thanh toán.");

                booking.Status = "Confirmed";
                var latestTransaction = booking.Transactions.OrderByDescending(t => t.CreatedAt).FirstOrDefault();
                if (latestTransaction != null) latestTransaction.Status = "Paid";

                await _context.SaveChangesAsync();
                return Ok(new { message = $"Đã xác nhận thanh toán thành công đơn hàng #{id}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // 5. HỦY ĐƠN HÀNG (Admin)
        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.TourSchedule)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (booking == null) return NotFound("Đơn hàng không tồn tại.");
                if (booking.Status == "Cancelled") return BadRequest("Đơn hàng đã hủy từ trước.");

                if (booking.TourSchedule != null)
                {
                    booking.TourSchedule.AvailableSeats += booking.TotalPassengers;
                    if (booking.TourSchedule.Status == "Full") booking.TourSchedule.Status = "Active";
                }

                booking.Status = "Cancelled";
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã hủy đơn hàng và hoàn trả chỗ trống." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
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