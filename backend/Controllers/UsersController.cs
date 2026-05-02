using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TravelTour.API.Data;

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

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Phone,
                u.IsLocked,
                u.CreatedAt,
                RoleName = u.Role != null ? u.Role.Name : "N/A"
            })
            .ToListAsync();

        return Ok(users);
    }

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

        return Ok(new
        {
            user.FullName,
            user.Email,
            user.Phone,
            user.CreatedAt,
            Role = user.Role?.Name
        });
    }

    [HttpPut("{id}/toggle-lock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleLock(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsLocked = !user.IsLocked;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = user.IsLocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản"
        });
    }

    [HttpPut("update-profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null)
            return NotFound(new { message = "Người dùng không tồn tại!" });

        user.FullName = request.FullName;
        user.Phone = request.Phone;

        if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != user.Id);
            if (emailExists)
                return BadRequest(new { message = "Email này đã được sử dụng bởi người khác!" });

            user.Email = request.Email;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật hồ sơ thành công!" });
    }

    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới!" });

        if (request.NewPassword.Length < 6)
            return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự!" });

        if (request.NewPassword != request.ConfirmPassword)
            return BadRequest(new { message = "Xác nhận mật khẩu mới không khớp!" });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null)
            return NotFound(new { message = "Người dùng không tồn tại!" });

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Mật khẩu hiện tại không đúng!" });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiry = null;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Đổi mật khẩu thành công!" });
    }
}

public class UpdateProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}
