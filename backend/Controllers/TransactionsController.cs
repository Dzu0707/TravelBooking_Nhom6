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

    [HttpPost]
    public async Task<IActionResult> Pay([FromBody] Transaction model)
    {
        try
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Transactions)
                .FirstOrDefaultAsync(b => b.Id == model.BookingId);

            if (booking == null) return NotFound("Không tìm thấy đơn đặt tour.");

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("Admin");
            if (booking.User?.Email != userEmail && !isAdmin)
            {
                return Forbid("Bạn không có quyền thanh toán cho đơn hàng này.");
            }

            if (booking.Status == "Confirmed" || booking.Status == "Paid")
            {
                return BadRequest("Đơn hàng này đã được thanh toán trước đó.");
            }

            model.CreatedAt = DateTime.Now;
            model.Status = "Pending";

            if (string.IsNullOrWhiteSpace(model.TransactionCode))
            {
                model.TransactionCode = $"PAYTOUR{booking.Id}NHOM6";
            }

            if (model.Amount <= 0)
            {
                model.Amount = booking.TotalPrice;
            }

            if (string.IsNullOrWhiteSpace(model.PaymentMethod))
            {
                model.PaymentMethod = "online";
            }

            _context.Transactions.Add(model);

            if (model.PaymentMethod.ToLower() == "cod")
            {
                booking.Status = "Pending";
            }
            else
            {
                booking.Status = "Pending";
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã ghi nhận giao dịch!",
                transactionCode = model.TransactionCode,
                amount = model.Amount
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi hệ thống khi thanh toán: {ex.Message}");
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var transactions = await _context.Transactions
                .Include(t => t.Booking)
                    .ThenInclude(b => b!.TourSchedule)
                        .ThenInclude(s => s!.Tour)
                .Include(t => t.Booking)
                    .ThenInclude(b => b!.User)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.Id,
                    t.TransactionCode,
                    t.Amount,
                    t.PaymentMethod,
                    t.CreatedAt,
                    t.Status,
                    BookingId = t.BookingId,
                    OrderCode = $"BOOKING-{t.BookingId}",
                    CustomerName = t.Booking != null
                        ? (!string.IsNullOrEmpty(t.Booking.ContactName)
                            ? t.Booking.ContactName
                            : (t.Booking.User != null ? t.Booking.User.FullName : "N/A"))
                        : "N/A",
                    ContactPhone = t.Booking != null ? t.Booking.ContactPhone : null,
                    ContactEmail = t.Booking != null ? t.Booking.ContactEmail : null,
                    TourName = t.Booking != null && t.Booking.TourSchedule != null && t.Booking.TourSchedule.Tour != null
                        ? t.Booking.TourSchedule.Tour.Name
                        : "N/A",
                    BookingStatus = t.Booking != null ? t.Booking.Status : "N/A"
                })
                .ToListAsync();

            var totalRevenue = transactions
                .Where(t => t.Status == "Paid" || t.Status == "Success" || t.BookingStatus == "Confirmed")
                .Sum(t => t.Amount);

            return Ok(new { totalRevenue, transactions });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi lấy dữ liệu: {ex.Message}");
        }
    }
}
