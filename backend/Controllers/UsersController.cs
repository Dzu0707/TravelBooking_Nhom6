using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;
using System.Security.Claims;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase 
{
    private readonly TravelDbContext _context;
    public UsersController(TravelDbContext context) => _context = context;

    // LẤY DANH SÁCH TẤT CẢ USER (Admin)
    [HttpGet] 
    public async Task<IActionResult> GetAll() 
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Select(u => new {
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
    
    // LẤY THÔNG TIN CÁ NHÂN (Dành cho User đang đăng nhập)
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile() 
    {
        // Lấy Email từ Token
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized(new { message = "Không xác định được danh tính!" });

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == userEmail);
            
        if (user == null) return NotFound(new { message = "Người dùng không tồn tại!" });

        return Ok(new { 
            user.FullName, 
            user.Email, 
            user.Phone,
            Role = user.Role?.Name 
        });
    }

    // KHÓA / MỞ KHÓA TÀI KHOẢN (Admin)
    [HttpPut("{id}/toggle-lock")]
    public async Task<IActionResult> ToggleLock(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsLocked = !user.IsLocked; 
        await _context.SaveChangesAsync();

        return Ok(new { message = user.IsLocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản" });
    }
}