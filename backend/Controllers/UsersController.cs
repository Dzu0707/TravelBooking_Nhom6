using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TravelTour.API.Data;

namespace TravelTour.API.Controllers;

public class UploadUserImageRequest
{
    public IFormFile File { get; set; } = default!;
}

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly TravelDbContext _context;

    public UsersController(TravelDbContext context)
    {
        _context = context;
    }

    [HttpPost("me/avatar")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadAvatar([FromForm] UploadUserImageRequest request)
    {
        return await UploadProfileImage(request.File, true);
    }

    [HttpPost("me/cover")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadCover([FromForm] UploadUserImageRequest request)
    {
        return await UploadProfileImage(request.File, false);
    }

    [HttpDelete("me/avatar")]
    [Authorize]
    public async Task<IActionResult> DeleteAvatar()
    {
        return await DeleteProfileImage(true);
    }

    [HttpDelete("me/cover")]
    [Authorize]
    public async Task<IActionResult> DeleteCover()
    {
        return await DeleteProfileImage(false);
    }

    private async Task<IActionResult> UploadProfileImage(IFormFile? file, bool isAvatar)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Vui lòng chọn file ảnh." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Ảnh phải nhỏ hơn 5MB." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        if (!allowed.Contains(ext))
            return BadRequest(new { message = "Chỉ hỗ trợ ảnh JPG, PNG, WEBP." });

        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null)
            return NotFound(new { message = "Người dùng không tồn tại!" });

        var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var folder = Path.Combine(webRoot, "uploads", "users");
        Directory.CreateDirectory(folder);

        var oldUrl = isAvatar ? user.AvatarUrl : user.CoverUrl;
        DeleteFileIfExists(oldUrl);

        var fileName = $"{user.Id}_{(isAvatar ? "avatar" : "cover")}_{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(folder, fileName);

        await using (var stream = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(stream);
        }

        var relativeUrl = $"/uploads/users/{fileName}";
        if (isAvatar) user.AvatarUrl = relativeUrl;
        else user.CoverUrl = relativeUrl;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Tải ảnh thành công!", imageUrl = relativeUrl });
    }

    private async Task<IActionResult> DeleteProfileImage(bool isAvatar)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null)
            return NotFound(new { message = "Người dùng không tồn tại!" });

        var oldUrl = isAvatar ? user.AvatarUrl : user.CoverUrl;
        DeleteFileIfExists(oldUrl);

        if (isAvatar) user.AvatarUrl = null;
        else user.CoverUrl = null;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa ảnh thành công." });
    }

    private static void DeleteFileIfExists(string? relativeUrl)
    {
        if (string.IsNullOrWhiteSpace(relativeUrl)) return;

        var cleaned = relativeUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
        var fullPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            cleaned.Replace($"wwwroot{Path.DirectorySeparatorChar}", "")
        );

        if (System.IO.File.Exists(fullPath))
            System.IO.File.Delete(fullPath);
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
            user.AvatarUrl,
            user.CoverUrl,
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