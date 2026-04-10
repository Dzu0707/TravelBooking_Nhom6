using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data;
using TravelTour.API.Models;
using System.Security.Claims;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly TravelDbContext _context;
    public ReviewsController(TravelDbContext context) => _context = context;

    // 1. Lấy tất cả đánh giá của 1 Tour (Dùng cho trang chi tiết Tour)
    [HttpGet("tour/{tourId}")]
    public async Task<IActionResult> GetByTour(int tourId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TourId == tourId)
            .Select(r => new {
                r.Id,
                r.Rating,
                r.Comment,
                // SỬA TẠI ĐÂY: Fix CS8602 bằng cách check null
                UserName = r.User != null ? r.User.FullName : "Người dùng ẩn danh",
                r.CreatedAt
            })
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
            
        return Ok(reviews);
    }
    // 2. Gửi đánh giá mới (Chỉ dành cho khách đã đăng nhập)
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Review model)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        
        if (user == null) return Unauthorized();

        model.UserId = user.Id;
        model.CreatedAt = DateTime.Now;

        _context.Reviews.Add(model);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cảm ơn bạn đã đánh giá!" });
    }
}