using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;
using System.Security.Claims;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase 
{
    private readonly TravelDbContext _context;
    public UsersController(TravelDbContext context) => _context = context;

    // 1. LẤY DANH SÁCH TẤT CẢ USER (Chỉ Admin)
    [HttpGet] 
    [Authorize(Roles = "Admin")] 
    public async Task<IActionResult> GetAll() 
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Select(u => new {
                u.Id,
                u.FullName,
                u.Email,
                u.Phone,
                u.Address, // Thêm hiển thị địa chỉ cho Admin
                u.IsLocked,
                u.CreatedAt,
                RoleName = u.Role != null ? u.Role.Name : "N/A"
            })
            .ToListAsync();
        return Ok(users);
    }
    
    // 2. LẤY THÔNG TIN CÁ NHÂN (User đang đăng nhập xem hồ sơ của mình)
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile() 
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) 
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == userEmail);
            
        if (user == null) 
            return NotFound(new { message = "Người dùng không tồn tại!" });

        return Ok(new { 
            user.FullName, 
            user.Email, 
            user.Phone,
            user.Address, // Trả về địa chỉ để Frontend hiển thị
            Role = user.Role?.Name 
        });
    }

    // 3. KHÓA / MỞ KHÓA TÀI KHOẢN (Chỉ Admin)
    [HttpPut("{id}/toggle-lock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleLock(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsLocked = !user.IsLocked; 
        await _context.SaveChangesAsync();

        return Ok(new { message = user.IsLocked ? "Đã khóa tài khoản thành công" : "Đã mở khóa tài khoản thành công" });
    }

    // 4. API CẬP NHẬT THÔNG TIN CÁ NHÂN
    [HttpPut("update-profile")]
    [Authorize] 
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        // Lấy Email từ Token
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) 
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ!" });

        // Tìm user trong Database
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null) 
            return NotFound(new { message = "Người dùng không tồn tại!" });

        // Cập nhật các trường thông tin cơ bản
        user.FullName = request.FullName;
        user.Phone = request.Phone;
        user.Address = request.Address; // ĐỒNG BỘ ĐỊA CHỈ TẠI ĐÂY

        // Kiểm tra và cập nhật Email nếu có thay đổi
        if (!string.IsNullOrWhiteSpace(request.Email) && request.Email != user.Email)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExists) 
                return BadRequest(new { message = "Email này đã được sử dụng bởi người khác!" });
            
            user.Email = request.Email;
        }

        // Cập nhật Mật khẩu (Chỉ khi người dùng có nhập mật khẩu mới)
        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword); 
        }

        // Lưu xuống Database
        try 
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật hồ sơ thành công!" });
        }
        catch (DbUpdateException ex)
        {
            // Trường hợp lỗi Database (ví dụ: độ dài chuỗi quá giới hạn)
            return StatusCode(500, new { message = "Lỗi lưu dữ liệu xuống máy chủ!", error = ex.Message });
        }
    }
}

// Lớp nhận dữ liệu DTO
public class UpdateProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty; 
    public string? NewPassword { get; set; } // Dùng string? để cho phép null
}