using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public NewsController(TravelDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tin tức
        [HttpGet]
        public async Task<IActionResult> GetNews()
        {
            var query = _context.News.AsQueryable();

            // LỌC DỮ LIỆU: Nếu không phải là Admin, chỉ hiển thị bài đang Publish và Chưa hết hạn
            if (!User.IsInRole("Admin"))
            {
                query = query.Where(n => n.IsPublished == true && 
                                        (n.ExpiryDate == null || n.ExpiryDate > DateTime.Now));
            }

            var newsList = await query.OrderByDescending(n => n.CreatedAt).ToListAsync();
            
            return Ok(newsList);
        }

        // Thêm tin tức (Chỉ Admin)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateNews([FromBody] News news)
        {
            news.CreatedAt = DateTime.Now;
            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return Ok(news);
        }

        // Cập nhật tin tức (Chỉ Admin)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(int id, [FromBody] News news)
        {
            if (id != news.Id) return BadRequest();
            
            _context.Entry(news).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(news);
        }

        // Xóa tin tức (Chỉ Admin)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return NotFound();
            
            _context.News.Remove(news);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa thành công" });
        }
        
        // Duyệt tin tức (Chỉ Admin)
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> ApproveNews(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return NotFound();

            news.IsPublished = true; // Chuyển trạng thái sang đã duyệt
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã duyệt bài thành công!" });
        }
    }
}