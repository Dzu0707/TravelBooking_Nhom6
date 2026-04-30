using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data; 
using TravelTour.API.Models;
using Microsoft.AspNetCore.Http;
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

        // --- 1. GET: Lấy danh sách tin tức (Kèm Category và Author để tránh lỗi đen màn hình) ---
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.NewsPosts
                .Include(n => n.Category)
                .Include(n => n.Author)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
            return Ok(posts);
        }

        // --- 2. GET: Chi tiết theo ID (Chỉ nhận số nguyên - fix lỗi 400) ---
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            var post = await _context.NewsPosts
                .Include(n => n.Category)
                .Include(n => n.Author)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (post == null) return NotFound(new { message = "Không tìm thấy bài viết theo ID!" });
            return Ok(post);
        }

        // --- 3. GET: Chi tiết theo SLUG (Nhận chuỗi chữ - Dùng cho NewsDetail.tsx) ---
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetNewsBySlug(string slug)
        {
            // Nếu slug là số, chuyển hướng sang GetNewsById
            if (int.TryParse(slug, out int id)) return await GetNewsById(id);

            var post = await _context.NewsPosts
                .Include(n => n.Category)
                .Include(n => n.Author)
                .FirstOrDefaultAsync(n => n.Slug == slug);

            if (post == null) return NotFound(new { message = "Không tìm thấy bài viết theo Slug!" });
            return Ok(post);
        }

        // --- 4. GET: Danh sách danh mục (Fix lỗi 400 trang Admin) ---
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.NewsCategories.ToListAsync();
            return Ok(categories);
        }

        // --- 5. GET: Danh sách thẻ (Fix lỗi 400 trang Admin) ---
        [HttpGet("tags")]
        public async Task<IActionResult> GetTags()
        {
            var tags = await _context.NewsTags.ToListAsync();
            return Ok(tags);
        }

        // --- 6. POST: Thêm tin tức mới ---
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NewsPost newsPost)
        {
            newsPost.CreatedAt = DateTime.UtcNow;
            newsPost.UpdatedAt = DateTime.UtcNow;
            
            // Gán AuthorId mặc định nếu frontend không gửi (thường lấy từ Token)
            if (newsPost.AuthorId == 0) newsPost.AuthorId = 1; 

            _context.NewsPosts.Add(newsPost);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNewsById), new { id = newsPost.Id }, newsPost);
        }

        // --- 7. PUT: Cập nhật tin tức ---
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NewsPost newsPost)
        {
            if (id != newsPost.Id) return BadRequest("ID không khớp!");

            var existing = await _context.NewsPosts.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = newsPost.Title;
            existing.Slug = newsPost.Slug;
            existing.Summary = newsPost.Summary; 
            existing.Content = newsPost.Content;
            existing.ThumbnailUrl = newsPost.ThumbnailUrl;
            existing.CategoryId = newsPost.CategoryId;
            existing.Status = newsPost.Status;
            existing.IsFeatured = newsPost.IsFeatured;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // --- 8. PUT: Xuất bản bài viết (Fix nút Publish Admin) ---
        [HttpPut("{id}/publish")]
        public async Task<IActionResult> Publish(int id)
        {
            var post = await _context.NewsPosts.FindAsync(id);
            if (post == null) return NotFound();

            post.Status = "Published";
            post.PublishedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xuất bản thành công" });
        }

        // --- 9. PUT: Bật/Tắt nổi bật (Fix nút Star Admin) ---
        [HttpPut("{id}/toggle-featured")]
        public async Task<IActionResult> ToggleFeatured(int id)
        {
            var post = await _context.NewsPosts.FindAsync(id);
            if (post == null) return NotFound();

            post.IsFeatured = !post.IsFeatured;
            await _context.SaveChangesAsync();
            return Ok(new { isFeatured = post.IsFeatured });
        }

        // --- 10. DELETE: Xóa tin tức ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.NewsPosts.FindAsync(id);
            if (post == null) return NotFound();

            _context.NewsPosts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // --- 11. UPLOAD ẢNH ---
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Vui lòng chọn tệp tin!");

            var uploadPath = Path.Combine(_env.ContentRootPath, "Uploads");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { url = "/uploads/" + fileName });
        }
    }
}