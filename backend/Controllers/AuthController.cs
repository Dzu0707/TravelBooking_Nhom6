using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TravelTour.API.Data;
using TravelTour.API.Models;
using Microsoft.EntityFrameworkCore;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase 
{
    private readonly TravelDbContext _context;
    private readonly IConfiguration _configuration; // Dùng IConfiguration để lấy Key từ appsettings.json

    public AuthController(TravelDbContext context, IConfiguration configuration) 
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto model) 
    {
        if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            return BadRequest(new { message = "Email đã tồn tại!" });

        // Kiểm tra RoleId 2 có tồn tại không để tránh lỗi khóa ngoại
        var roleExists = await _context.Roles.AnyAsync(r => r.Id == 2);
        
        var user = new User {
            FullName = model.FullName,
            Email = model.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            RoleId = roleExists ? 2 : 1, // Fallback nếu DB chưa có RoleId 2
            CreatedAt = DateTime.Now,
            IsLocked = false // Mặc định không khóa
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đăng ký thành công!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == model.Email);

        if (user == null)
            return Unauthorized(new { message = "Email không tồn tại!" });

        if (user.IsLocked)
            return Unauthorized(new { message = "Tài khoản bị khóa!" });

        if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            return Unauthorized(new { message = "Sai mật khẩu!" });

        var token = CreateToken(user);

        return Ok(new
        {
            token,
            role = user.Role?.Name ?? "User",
            roleId = user.RoleId,
            fullName = user.FullName
        });
    }

    private string CreateToken(User user) 
    {
        var claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Dùng Id thay vì Name cho an toàn
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
        };

        // Lấy Key từ cấu hình, nếu không có mới dùng chuỗi mặc định (để không bị crash)
        var keyString = _configuration["Jwt:Key"] ?? "Chuoi_Bi_Mat_Sieu_Cap_Vip_123456_Dai_Hon_32_Ky_Tu";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// Khuyến khích đưa các Class này ra file riêng trong thư mục DTOs
public class LoginModel { 
    public string Email { get; set; } = string.Empty; 
    public string Password { get; set; } = string.Empty; 
}

public class UserRegisterDto {
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}