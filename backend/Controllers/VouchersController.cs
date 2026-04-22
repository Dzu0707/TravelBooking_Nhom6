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

    // 1. LẤY DANH SÁCH TẤT CẢ VOUCHER
    [HttpGet]
    [Authorize]
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

    // 2. TẠO VOUCHER MỚI
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Voucher model)
    {
        if (model == null) return BadRequest();
        model.Code = model.Code.ToUpper(); 

        if (await _context.Vouchers.AnyAsync(v => v.Code == model.Code))
            return BadRequest(new { message = "Mã voucher này đã tồn tại!" });

        _context.Vouchers.Add(model);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Tạo voucher thành công!", voucher = model });
    }

    // 3. CẬP NHẬT VOUCHER (FIX LỖI 405)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] Voucher model)
    {
        var voucher = await _context.Vouchers.FindAsync(id);
        if (voucher == null) return NotFound(new { message = "Không tìm thấy voucher!" });

        // Cập nhật các trường dữ liệu
        voucher.Code = model.Code.ToUpper();
        voucher.DiscountType = model.DiscountType;
        voucher.DiscountValue = model.DiscountValue;
        voucher.Quantity = model.Quantity;
        voucher.ExpiryDate = model.ExpiryDate;

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!", voucher });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Lỗi khi cập nhật: " + ex.Message });
        }
    }

    // 4. XÓA VOUCHER
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var voucher = await _context.Vouchers
            .Include(v => v.Bookings)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (voucher == null) return NotFound(new { message = "Không tìm thấy mã giảm giá!" });

        if (voucher.Bookings != null && voucher.Bookings.Any())
            return BadRequest(new { message = "Không thể xóa vì mã này đã có người sử dụng!" });

        _context.Vouchers.Remove(voucher);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa mã giảm giá thành công!" });
    }

    // 5. KIỂM TRA MÃ GIẢM GIÁ
    [HttpPost("validate")]
    [Authorize]
    public async Task<IActionResult> Validate([FromBody] VoucherCheckRequest request)
    {
        var voucher = await _context.Vouchers
            .FirstOrDefaultAsync(v => v.Code == request.Code.ToUpper());

        if (voucher == null) return NotFound(new { message = "Mã giảm giá không tồn tại!" });
        if (DateTime.Now > voucher.ExpiryDate) return BadRequest(new { message = "Mã giảm giá này đã hết hạn!" });
        if (voucher.Quantity <= 0) return BadRequest(new { message = "Mã giảm giá này đã hết lượt!" });

        return Ok(new {
            id = voucher.Id,
            code = voucher.Code,
            discountType = voucher.DiscountType,
            discountValue = voucher.DiscountValue,
            message = "Áp dụng mã thành công!"
        });
    }
}

// KHAI BÁO CLASS NÀY Ở ĐÂY ĐỂ TRÁNH LỖI CS0246
public class VoucherCheckRequest 
{
    public string Code { get; set; } = string.Empty;
    public decimal OrderAmount { get; set; }
}