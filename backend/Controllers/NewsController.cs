using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data; 
using TravelTour.API.Models;
using Microsoft.AspNetCore.Http; // Bắt buộc để dùng IFormFile
using System.IO;

namespace TravelTour.API.Controllers 
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly TravelDbContext _context;
        private readonly IWebHostEnvironment _env;

        public NewsController(TravelDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // --- 1. GET: Lấy danh sách tin tức (Người dùng & Admin) ---
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var news = await _context.News.OrderByDescending(n => n.CreatedAt).ToListAsync();
            return Ok(news);
        }

        // --- 2. GET: Chi tiết tin tức ---
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return NotFound(new { message = "Không tìm thấy bài viết!" });
            return Ok(news);
        }

        // --- 3. POST: Thêm tin tức mới (Admin) ---
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] News news)
        {
            news.CreatedAt = DateTime.Now;
            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNewsById), new { id = news.Id }, news);
        }

        // --- 4. UPLOAD ẢNH (Admin) ---
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Vui lòng chọn tệp tin!");

            // Đường dẫn tới thư mục Uploads đã cấu hình trong Program.cs
            var uploadPath = Path.Combine(_env.ContentRootPath, "Uploads");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về đường dẫn để lưu vào database (Frontend sẽ gọi http://localhost:5091/uploads/ten-anh.jpg)
            return Ok(new { url = "/uploads/" + fileName });
        }

        // --- 5. PUT: Cập nhật tin tức (Admin) ---
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] News news)
        {
            if (id != news.Id) return BadRequest("ID không khớp!");

            var existingNews = await _context.News.FindAsync(id);
            if (existingNews == null) return NotFound();

            existingNews.Title = news.Title;
            existingNews.ShortDescription = news.ShortDescription;
            existingNews.Content = news.Content;
            existingNews.ImageUrl = news.ImageUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // --- 6. DELETE: Xóa tin tức (Admin) ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return NotFound();

            _context.News.Remove(news);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}