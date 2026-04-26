using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data; 
using TravelTour.API.Models; // Đảm bảo bạn đã có folder Models chứa class News

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

        // GET: api/news - Lấy danh sách tất cả tin tức
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var news = await _context.News.OrderByDescending(n => n.CreatedAt).ToListAsync();
            return Ok(news);
        }

        // GET: api/news/{id} - Lấy chi tiết 1 bài tin tức
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            var news = await _context.News.FindAsync(id);
            
            if (news == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này!" });
            }
            
            return Ok(news);
        }
    }
}