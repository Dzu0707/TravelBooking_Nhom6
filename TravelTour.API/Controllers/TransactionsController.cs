using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;

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
        // 1. Kiểm tra Booking có tồn tại không
        var booking = await _context.Bookings.FindAsync(model.BookingId);
        if (booking == null) return NotFound("Không tìm thấy đơn đặt tour.");

        // 2. Tạo bản ghi giao dịch (Transaction) bám sát ERD
        model.CreatedAt = DateTime.Now;
        model.Status = "Success"; // Giả định thanh toán thành công
        _context.Transactions.Add(model);

        // 3. Cập nhật trạng thái Booking sang "Completed" hoặc "Paid"
        booking.Status = "Completed";
        
        await _context.SaveChangesAsync();

        return Ok(new { 
            message = "Thanh toán thành công!", 
            transactionCode = model.TransactionCode 
        });
    }

    // Lấy lịch sử giao dịch (Chỉ dành cho Admin xem doanh thu)
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var totalRevenue = await _context.Transactions.SumAsync(t => t.Amount);
        var transactions = await _context.Transactions
            .Include(t => t.Booking)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(new { totalRevenue, transactions });
    }
}