    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.AspNetCore.Authorization;
    using TravelTour.API.Data;
    using TravelTour.API.Models;
    using System.Security.Claims;

    namespace TravelTour.API.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class ReviewsController : ControllerBase
        {
            private readonly TravelDbContext _context;
            public ReviewsController(TravelDbContext context) => _context = context;

            [HttpGet("tour/{tourId}")]
            public async Task<IActionResult> GetByTour(int tourId)
            {
                var reviews = await _context.Reviews
                    .AsNoTracking()
                    .Include(r => r.User)
                    .Where(r => r.TourId == tourId)
                    .Select(r => new {
                        id = r.Id,
                        rating = r.Rating,
                        comment = r.Comment,
                        userId = r.UserId,
                        userName = r.User != null ? r.User.FullName : "Người dùng ẩn danh",
                        createdAt = r.CreatedAt
                    })
                    .OrderByDescending(r => r.createdAt)
                    .ToListAsync();
                    
                return Ok(reviews);
            }

            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                var reviews = await _context.Reviews
                    .AsNoTracking()
                    .Include(r => r.User)
                    .Select(r => new {
                        id = r.Id,
                        rating = r.Rating,
                        comment = r.Comment,
                        userId = r.UserId,
                        userName = r.User != null ? r.User.FullName : "Người dùng ẩn danh",
                        createdAt = r.CreatedAt
                    })
                    .OrderByDescending(r => r.createdAt)
                    .ToListAsync();

                return Ok(reviews);
            }

            [Authorize]
            [HttpPost]
            public async Task<IActionResult> Post([FromBody] Review model)
            {
                try
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

                    model.UserId = int.Parse(userIdClaim);
                    model.CreatedAt = DateTime.Now;

                    _context.Reviews.Add(model);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Gửi đánh giá thành công!" });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = "Lỗi hệ thống: " + ex.Message });
                }
            }

            [Authorize]
            [HttpDelete("{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                var review = await _context.Reviews.FindAsync(id);
                if (review == null) return NotFound();

                // Lấy ID từ Token và Role
                var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // Chuyển đổi ID về int để so sánh chính xác
                bool isOwner = false;
                if (int.TryParse(userIdFromToken, out int currentUserId))
                {
                    isOwner = review.UserId == currentUserId;
                }

                bool isAdmin = userRole == "Admin";

                // KIỂM TRA QUYỀN
                if (!isAdmin && !isOwner)
                {
                    return Forbid(); 
                }

                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã xóa đánh giá thành công" });
            }
            
        }
    }