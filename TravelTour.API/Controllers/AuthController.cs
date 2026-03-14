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

    public AuthController(TravelDbContext context) 
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto model) 
    {
        if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            return BadRequest("Email đã tồn tại!");

        var user = new User {
            FullName = model.FullName,
            Email = model.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            RoleId = 2, // Đảm bảo bảng Roles đã có Id = 2
            CreatedAt = DateTime.Now
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

        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash)) {
            return Unauthorized("Sai tài khoản hoặc mật khẩu!");
        }

        var token = CreateToken(user); 

        // TRẢ VỀ CẢ TOKEN VÀ USER ĐỂ REACT KHÔNG BỊ LỖI UNDEFINED
        return Ok(new { 
            token = token, 
            user = new { 
                fullName = user.FullName, 
                email = user.Email, 
                role = user.Role?.Name ?? "User" 
            } 
        });
    }

    private string CreateToken(User user) 
    {
        var claims = new List<Claim> {
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Chuoi_Bi_Mat_Sieu_Cap_Vip_123456"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// --- HAI CLASS NÀY PHẢI NẰM Ở ĐÂY ĐỂ HẾT LỖI CS0246 ---
public class LoginModel { 
    public string Email { get; set; } = ""; 
    public string Password { get; set; } = ""; 
}

public class UserRegisterDto {
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}