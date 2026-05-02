using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly TravelDbContext _context;
    private readonly IConfiguration _configuration;

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

        var roleExists = await _context.Roles.AnyAsync(r => r.Id == 2);

        var user = new User
        {
            FullName = model.FullName,
            Email = model.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            RoleId = roleExists ? 2 : 1,
            CreatedAt = DateTime.Now,
            IsLocked = false,
            Phone = model.Phone
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
            id = user.Id,
            role = user.Role?.Name ?? "User",
            roleId = user.RoleId,
            fullName = user.FullName,
            email = user.Email,
            phone = user.Phone
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email không được để trống!" });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email.Trim());

        if (user != null)
        {
            user.ResetPasswordToken = Guid.NewGuid().ToString("N");
            user.ResetPasswordTokenExpiry = DateTime.Now.AddMinutes(30);
            await _context.SaveChangesAsync();

            var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendBaseUrl}/reset-password?token={user.ResetPasswordToken}";

            await SendResetPasswordEmailAsync(user.Email, user.FullName, resetLink);
        }

        return Ok(new
        {
            message = "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
            return BadRequest(new { message = "Token không hợp lệ!" });

        if (string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "Mật khẩu mới không được để trống!" });

        if (request.NewPassword.Length < 6)
            return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự!" });

        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.ResetPasswordToken == request.Token &&
            u.ResetPasswordTokenExpiry != null &&
            u.ResetPasswordTokenExpiry > DateTime.Now);

        if (user == null)
            return BadRequest(new { message = "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!" });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiry = null;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Đặt lại mật khẩu thành công!" });
    }

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
        };

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

    private async Task SendResetPasswordEmailAsync(string toEmail, string fullName, string resetLink)
    {
        var host = _configuration["Smtp:Host"];
        var username = _configuration["Smtp:Username"];
        var password = _configuration["Smtp:Password"];
        var fromEmail = _configuration["Smtp:FromEmail"] ?? username;
        var fromName = _configuration["Smtp:FromName"] ?? "TravelGo";
        var port = int.TryParse(_configuration["Smtp:Port"], out var smtpPort) ? smtpPort : 587;
        var enableSsl = bool.TryParse(_configuration["Smtp:EnableSsl"], out var ssl) ? ssl : true;

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("Chưa cấu hình SMTP trong appsettings.");

        using var message = new MailMessage();
        message.From = new MailAddress(fromEmail!, fromName);
        message.To.Add(toEmail);
        message.Subject = "Yêu cầu đặt lại mật khẩu";
        message.IsBodyHtml = true;
        message.Body = $@"
            <div style='font-family:Arial,sans-serif;font-size:14px;color:#0f172a'>
                <p>Xin chào <strong>{WebUtility.HtmlEncode(fullName)}</strong>,</p>
                <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản TravelGo.</p>
                <p>
                    <a href='{resetLink}' style='display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px'>
                        Đặt lại mật khẩu
                    </a>
                </p>
                <p>Liên kết này sẽ hết hạn sau 30 phút.</p>
                <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
            </div>";

        using var client = new SmtpClient(host, port)
        {
            Credentials = new NetworkCredential(username, password),
            EnableSsl = enableSsl
        };

        await client.SendMailAsync(message);
    }
}

public class LoginModel
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UserRegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
