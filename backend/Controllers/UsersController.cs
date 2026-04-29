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
    
    public UsersController(TravelDbContext context) 
    {
        _context = context;
    }

    // 1. LẤY DANH SÁCH TẤT CẢ USER (Chỉ dành cho Admin)
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
                u.Address,
                u.IsLocked,
                u.CreatedAt,
                RoleName = u.Role != null ? u.Role.Name : "N/A"
            })
            .ToListAsync();
        return Ok(users);
    }
    
    // 2. LẤY THÔNG TIN CÁ NHÂN (Dành cho User đang đăng nhập)
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

        // Trả về đầy đủ thông tin bao gồm Address
        return Ok(new { 
            user.FullName, 
            user.Email, 
            user.Phone,
            user.Address, 
            Role = user.Role?.Name 
        });
    }

    // 3. KHÓA / MỞ KHÓA TÀI KHOẢN (Chỉ dành cho Admin)
    [HttpPut("{id}/toggle-lock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleLock(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsLocked = !user.IsLocked; 
        await _context.SaveChangesAsync();

        return Ok(new { message = user.IsLocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản" });
    }

    // 4. API CẬP NHẬT THÔNG TIN CÁ NHÂN
    [HttpPut("update-profile")]
    [Authorize] 
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        // 1. Lấy Email từ Token
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) 
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        // 2. Tìm user trong Database
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null) 
            return NotFound(new { message = "Người dùng không tồn tại!" });

        // 3. Cập nhật các trường thông tin
        user.FullName = request.FullName;
        user.Phone = request.Phone;
        user.Address = request.Address; // Cập nhật địa chỉ

        // 4. Kiểm tra và cập nhật Email nếu có thay đổi
        if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExists) 
                return BadRequest(new { message = "Email này đã được sử dụng bởi người khác!" });
            
            user.Email = request.Email;
        }

        // 5. Kiểm tra và cập nhật Mật khẩu nếu có
        if (!string.IsNullOrEmpty(request.NewPassword))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword); 
        }

        // 6. Lưu xuống Database
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật hồ sơ thành công!" });
    }
}

// Class DTO nhận dữ liệu từ React gửi lên
public class UpdateProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty; 
    public string NewPassword { get; set; } = string.Empty;
}