using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;
using System.Security.Claims;

namespace TravelTour.API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TransactionsController : ControllerBase
{
    private readonly TravelDbContext _context;
    public TransactionsController(TravelDbContext context) => _context = context;

    // POST: api/Transactions (Xác nhận thanh toán)
    [HttpPost]
    public async Task<IActionResult> Pay([FromBody] Transaction model)
    {
        try 
        {
            // 1. Kiểm tra Booking có tồn tại không
            var booking = await _context.Bookings
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == model.BookingId);

            if (booking == null) return NotFound("Không tìm thấy đơn đặt tour.");

            // 2. Bảo mật: Kiểm tra xem người đang đăng nhập có phải chủ nhân đơn hàng không
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (booking.User?.Email != userEmail && !isAdmin)
            {
                return Forbid("Bạn không có quyền thanh toán cho đơn hàng này.");
            }

            // 3. Kiểm tra trạng thái đơn hàng (Tránh thanh toán 2 lần)
            if (booking.Status == "Completed" || booking.Status == "Paid")
            {
                return BadRequest("Đơn hàng này đã được thanh toán trước đó.");
            }

            // 4. Tạo bản ghi giao dịch
            model.CreatedAt = DateTime.Now;
            model.Status = "Success"; 
            
            // Gán số tiền từ Booking nếu model gửi lên bị thiếu (đảm bảo an toàn doanh thu)
            if (model.Amount <= 0) model.Amount = booking.TotalPrice;

            _context.Transactions.Add(model);

            // 5. Cập nhật trạng thái Booking
            // "Paid" là trạng thái hợp lý sau khi thanh toán thành công
            booking.Status = "Paid"; 
            
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Thanh toán thành công!", 
                transactionCode = model.TransactionCode,
                amount = model.Amount
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi hệ thống khi thanh toán: {ex.Message}");
        }
    }

    // Lấy lịch sử giao dịch & Thống kê doanh thu (Admin)
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var transactions = await _context.Transactions
                .Include(t => t.Booking)
                    .ThenInclude(b => b!.User)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new {
                    t.Id,
                    t.TransactionCode,
                    t.Amount,
                    t.PaymentMethod,
                    t.CreatedAt,
                    t.Status,
                    BookingId = t.BookingId,
                    CustomerName = t.Booking != null && t.Booking.User != null ? t.Booking.User.FullName : "N/A"
                })
                .ToListAsync();

            var totalRevenue = transactions.Sum(t => t.Amount);

            return Ok(new { totalRevenue, transactions });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi lấy dữ liệu: {ex.Message}");
        }
    }
}