<<<<<<< HEAD
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Globalization;
using System.Text;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewsController : ControllerBase
{
    private readonly TravelDbContext _context;
    private readonly ILogger<NewsController> _logger;

    public NewsController(TravelDbContext context, ILogger<NewsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        [FromQuery] int? categoryId,
        [FromQuery] string? keyword,
        [FromQuery] bool? isFeatured) // Hỗ trợ lọc Tin nổi bật
    {
        try 
        {
            var query = _context.NewsPosts
                .Include(x => x.Category)
                .Include(x => x.Author)
                .Include(x => x.PublishedBy)
                .Include(x => x.NewsTagMaps)
                    .ThenInclude(x => x.NewsTag)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(x => x.Status == status);

            if (categoryId.HasValue)
                query = query.Where(x => x.CategoryId == categoryId.Value);

            if (isFeatured.HasValue)
                query = query.Where(x => x.IsFeatured == isFeatured.Value);

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(x =>
                    x.Title.Contains(keyword) ||
                    x.Summary.Contains(keyword) ||
                    x.Slug.Contains(keyword));

            var posts = await query
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new
                {
                    x.Id, x.Title, x.Slug, x.Summary, x.ThumbnailUrl, x.Status,
                    x.IsFeatured, x.ViewCount, x.PublishedAt, x.CreatedAt,
                    Category = x.Category.Name,
                    Author = x.Author.FullName,
                    PublishedBy = x.PublishedBy != null ? x.PublishedBy.FullName : null,
                    Tags = x.NewsTagMaps.Select(t => t.NewsTag.Name).ToList()
                })
                .ToListAsync();

            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách tin tức");
            return StatusCode(500, new { message = "Lỗi hệ thống!" });
        }
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await _context.NewsPosts
            .Include(x => x.Category)
            .Include(x => x.Author)
            .Include(x => x.NewsTagMaps)
                .ThenInclude(x => x.NewsTag)
            .FirstOrDefaultAsync(x => x.Slug == slug);

        if (post == null)
            return NotFound(new { message = "Không tìm thấy bài viết!" });

        return Ok(new
        {
            post.Id, post.Title, post.Slug, post.Summary, post.Content, post.ThumbnailUrl,
            post.CategoryId, 
            CategoryName = post.Category.Name,
            post.AuthorId, 
            AuthorName = post.Author.FullName,
            post.Status, post.IsFeatured, post.ViewCount, post.PublishedAt,
            post.CreatedAt, post.UpdatedAt,
            Tags = post.NewsTagMaps.Select(x => new { x.NewsTag.Name, x.NewsTag.Slug }).ToList()
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateNewsRequest request)
    {
        try {
            if (string.IsNullOrWhiteSpace(request.Title)) return BadRequest(new { message = "Tiêu đề trống!" });
            
            request.Slug = GenerateSlug(string.IsNullOrWhiteSpace(request.Slug) ? request.Title : request.Slug);
            
            if (await _context.NewsPosts.AnyAsync(x => x.Slug == request.Slug))
                return BadRequest(new { message = "Slug đã tồn tại!" });

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var author = await _context.Users.FirstOrDefaultAsync(x => x.Email == userEmail);
            if (author == null) return Unauthorized();

            var post = new NewsPost
            {
                Title = request.Title, Slug = request.Slug, Summary = request.Summary,
                Content = request.Content, ThumbnailUrl = request.ThumbnailUrl,
                CategoryId = request.CategoryId, AuthorId = author.Id,
                Status = request.Status, IsFeatured = request.IsFeatured,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            };

            _context.NewsPosts.Add(post);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thành công!", post.Id });
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Lỗi tạo tin tức");
            return StatusCode(500, "Lỗi server");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateNewsRequest request)
    {
        var post = await _context.NewsPosts
            .Include(x => x.NewsTagMaps)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (post == null) return NotFound(new { message = "Không tìm thấy bài viết!" });

        post.Title = request.Title;
        post.Slug = GenerateSlug(string.IsNullOrWhiteSpace(request.Slug) ? request.Title : request.Slug);
        post.Summary = request.Summary;
        post.Content = request.Content;
        post.ThumbnailUrl = request.ThumbnailUrl;
        post.CategoryId = request.CategoryId;
        post.Status = request.Status;
        post.IsFeatured = request.IsFeatured;
        post.UpdatedAt = DateTime.UtcNow;

        _context.NewsTagMaps.RemoveRange(post.NewsTagMaps);
        if (request.TagIds != null && request.TagIds.Count > 0)
        {
            var tagMaps = request.TagIds.Select(tagId => new NewsTagMap { NewsPostId = post.Id, NewsTagId = tagId });
            _context.NewsTagMaps.AddRange(tagMaps);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công!" });
    }

    private static string GenerateSlug(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var normalizedString = input.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();
        foreach (var c in normalizedString)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != UnicodeCategory.NonSpacingMark) stringBuilder.Append(c);
        }
        return stringBuilder.ToString()
            .Normalize(NormalizationForm.FormC)
            .ToLower()
            .Replace("đ", "d")
            .Replace(" ", "-")
            .Replace("/", "-")
            .Replace("?", "");
    }
}

// --- DTO CLASSES ---

public class CreateNewsRequest
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public int CategoryId { get; set; }
    public string Status { get; set; } = "Draft";
    public bool IsFeatured { get; set; }
    public List<int> TagIds { get; set; } = new();
}

public class UpdateNewsRequest
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public int CategoryId { get; set; }
    public string Status { get; set; } = "Draft";
    public bool IsFeatured { get; set; }
    public List<int> TagIds { get; set; } = new();
=======
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
>>>>>>> 9fcc8939d677855e115e5ea79c439a0f496ca9fa
}