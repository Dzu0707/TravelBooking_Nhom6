using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VouchersController : ControllerBase
{
    private readonly TravelDbContext _context;
    public VouchersController(TravelDbContext context) => _context = context;

    // LẤY DANH SÁCH TẤT CẢ VOUCHER (Admin mới xem được hết)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var vouchers = await _context.Vouchers
            .Select(v => new {
                v.Id,
                v.Code,
                v.DiscountType,
                v.DiscountValue,
                v.Quantity,
                v.ExpiryDate,
                IsExpired = v.ExpiryDate < DateTime.Now,
                UsageCount = v.Bookings != null ? v.Bookings.Count : 0
            })
            .OrderByDescending(v => v.Id)
            .ToListAsync();

        return Ok(vouchers);
    }

    // TẠO VOUCHER MỚI (Admin)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Voucher model)
    {
        if (model == null) return BadRequest();

        model.Code = model.Code.ToUpper(); // Chuẩn hóa mã

        if (await _context.Vouchers.AnyAsync(v => v.Code == model.Code))
            return BadRequest(new { message = "Mã voucher này đã tồn tại!" });

        _context.Vouchers.Add(model);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tạo voucher thành công!", voucher = model });
    }

    // XÓA VOUCHER (Admin)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var voucher = await _context.Vouchers.FindAsync(id);
        if (voucher == null) return NotFound(new { message = "Không tìm thấy mã giảm giá!" });

        _context.Vouchers.Remove(voucher);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa mã giảm giá thành công!" });
    }

    // KIỂM TRA MÃ GIẢM GIÁ (Dành cho User khi đặt Tour - Chỉ cần Login)
    [HttpPost("validate")]
    [Authorize]
    public async Task<IActionResult> Validate([FromBody] VoucherCheckRequest request)
    {
        var voucher = await _context.Vouchers
            .FirstOrDefaultAsync(v => v.Code == request.Code.ToUpper());

        if (voucher == null)
            return NotFound(new { message = "Mã giảm giá không tồn tại!" });

        if (DateTime.Now > voucher.ExpiryDate)
            return BadRequest(new { message = "Mã giảm giá này đã hết hạn!" });

        if (voucher.Quantity <= 0)
            return BadRequest(new { message = "Mã giảm giá này đã hết lượt sử dụng!" });

        // Tính toán số tiền giảm
        decimal discountAmount = 0;
        if (voucher.DiscountType == "Percentage")
        {
            discountAmount = request.OrderAmount * (voucher.DiscountValue / 100);
        }
        else // FixedAmount
        {
            discountAmount = voucher.DiscountValue;
        }

        // Không cho giảm quá tổng tiền
        if (discountAmount > request.OrderAmount) discountAmount = request.OrderAmount;

        return Ok(new {
            voucherId = voucher.Id,
            discountAmount,
            finalAmount = request.OrderAmount - discountAmount,
            message = "Áp dụng mã thành công!"
        });
    }
}

// Request model để nhận dữ liệu từ Client
public class VoucherCheckRequest 
{
    public string Code { get; set; } = string.Empty;
    public decimal OrderAmount { get; set; }
}