using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewsController : ControllerBase
{
    private readonly TravelDbContext _context;
    public NewsController(TravelDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        [FromQuery] int? categoryId,
        [FromQuery] string? keyword)
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

        if (!string.IsNullOrWhiteSpace(keyword))
            query = query.Where(x =>
                x.Title.Contains(keyword) ||
                x.Summary.Contains(keyword) ||
                x.Slug.Contains(keyword));

        var posts = await query
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Slug,
                x.Summary,
                x.ThumbnailUrl,
                x.Status,
                x.IsFeatured,
                x.ViewCount,
                x.PublishedAt,
                x.CreatedAt,
                Category = x.Category.Name,
                Author = x.Author.FullName,
                PublishedBy = x.PublishedBy != null ? x.PublishedBy.FullName : null,
                Tags = x.NewsTagMaps.Select(t => t.NewsTag.Name).ToList()
            })
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _context.NewsPosts
            .Include(x => x.Category)
            .Include(x => x.Author)
            .Include(x => x.PublishedBy)
            .Include(x => x.NewsTagMaps)
                .ThenInclude(x => x.NewsTag)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (post == null)
            return NotFound(new { message = "Không tìm thấy bài viết!" });

        return Ok(new
        {
            post.Id,
            post.Title,
            post.Slug,
            post.Summary,
            post.Content,
            post.ThumbnailUrl,
            post.CategoryId,
            CategoryName = post.Category.Name,
            post.AuthorId,
            AuthorName = post.Author.FullName,
            post.PublishedById,
            PublishedByName = post.PublishedBy?.FullName,
            post.Status,
            post.IsFeatured,
            post.ViewCount,
            post.PublishedAt,
            post.CreatedAt,
            post.UpdatedAt,
            TagIds = post.NewsTagMaps.Select(x => x.NewsTagId).ToList(),
            Tags = post.NewsTagMaps.Select(x => new
            {
                x.NewsTagId,
                x.NewsTag.Name,
                x.NewsTag.Slug
            }).ToList()
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateNewsRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Tiêu đề không được để trống!" });

        if (string.IsNullOrWhiteSpace(request.Slug))
            request.Slug = GenerateSlug(request.Title);

        var slugExists = await _context.NewsPosts.AnyAsync(x => x.Slug == request.Slug);
        if (slugExists)
            return BadRequest(new { message = "Slug đã tồn tại!" });

        var categoryExists = await _context.NewsCategories.AnyAsync(x => x.Id == request.CategoryId);
        if (!categoryExists)
            return BadRequest(new { message = "Danh mục không tồn tại!" });

        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        var author = await _context.Users.FirstOrDefaultAsync(x => x.Email == userEmail);
        if (author == null)
            return Unauthorized(new { message = "Người dùng không tồn tại!" });

        var post = new NewsPost
        {
            Title = request.Title,
            Slug = request.Slug,
            Summary = request.Summary,
            Content = request.Content,
            ThumbnailUrl = request.ThumbnailUrl,
            CategoryId = request.CategoryId,
            AuthorId = author.Id,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Draft" : request.Status,
            IsFeatured = request.IsFeatured,
            ViewCount = 0,
            PublishedAt = request.Status == "Published" ? DateTime.Now : null,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            PublishedById = request.Status == "Published" ? author.Id : null
        };

        _context.NewsPosts.Add(post);
        await _context.SaveChangesAsync();

        if (request.TagIds != null && request.TagIds.Count > 0)
        {
            var validTagIds = await _context.NewsTags
                .Where(x => request.TagIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync();

            var tagMaps = validTagIds.Select(tagId => new NewsTagMap
            {
                NewsPostId = post.Id,
                NewsTagId = tagId
            });

            _context.NewsTagMaps.AddRange(tagMaps);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Tạo bài viết thành công!", post.Id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateNewsRequest request)
    {
        var post = await _context.NewsPosts
            .Include(x => x.NewsTagMaps)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (post == null)
            return NotFound(new { message = "Không tìm thấy bài viết!" });

        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Tiêu đề không được để trống!" });

        if (string.IsNullOrWhiteSpace(request.Slug))
            request.Slug = GenerateSlug(request.Title);

        var slugExists = await _context.NewsPosts.AnyAsync(x => x.Slug == request.Slug && x.Id != id);
        if (slugExists)
            return BadRequest(new { message = "Slug đã tồn tại!" });

        var categoryExists = await _context.NewsCategories.AnyAsync(x => x.Id == request.CategoryId);
        if (!categoryExists)
            return BadRequest(new { message = "Danh mục không tồn tại!" });

        post.Title = request.Title;
        post.Slug = request.Slug;
        post.Summary = request.Summary;
        post.Content = request.Content;
        post.ThumbnailUrl = request.ThumbnailUrl;
        post.CategoryId = request.CategoryId;
        post.Status = request.Status;
        post.IsFeatured = request.IsFeatured;
        post.UpdatedAt = DateTime.Now;

        _context.NewsTagMaps.RemoveRange(post.NewsTagMaps);

        if (request.TagIds != null && request.TagIds.Count > 0)
        {
            var validTagIds = await _context.NewsTags
                .Where(x => request.TagIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync();

            var tagMaps = validTagIds.Select(tagId => new NewsTagMap
            {
                NewsPostId = post.Id,
                NewsTagId = tagId
            });

            _context.NewsTagMaps.AddRange(tagMaps);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật bài viết thành công!" });
    }

    [HttpPut("{id}/publish")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Publish(int id)
    {
        var post = await _context.NewsPosts.FindAsync(id);
        if (post == null)
            return NotFound(new { message = "Không tìm thấy bài viết!" });

        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized(new { message = "Không xác định được danh tính!" });

        var publisher = await _context.Users.FirstOrDefaultAsync(x => x.Email == userEmail);
        if (publisher == null)
            return Unauthorized(new { message = "Người dùng không tồn tại!" });

        post.Status = "Published";
        post.PublishedAt = DateTime.Now;
        post.PublishedById = publisher.Id;
        post.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Xuất bản bài viết thành công!" });
    }

    [HttpPut("{id}/toggle-featured")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleFeatured(int id)
    {
        var post = await _context.NewsPosts.FindAsync(id);
        if (post == null)
            return NotFound(new { message = "Không tìm thấy bài viết!" });

        post.IsFeatured = !post.IsFeatured;
        post.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return Ok(new { message = post.IsFeatured ? "Đã bật nổi bật" : "Đã tắt nổi bật" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await _context.NewsPosts.FindAsync(id);
        if (post == null)
            return NotFound(new { message = "Không tìm thấy bài viết!" });

        _context.NewsPosts.Remove(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa bài viết thành công!" });
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.NewsCategories
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Slug,
                x.Description,
                x.IsActive
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost("categories")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateNewsCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên danh mục không được để trống!" });

        if (string.IsNullOrWhiteSpace(request.Slug))
            request.Slug = GenerateSlug(request.Name);

        var slugExists = await _context.NewsCategories.AnyAsync(x => x.Slug == request.Slug);
        if (slugExists)
            return BadRequest(new { message = "Slug danh mục đã tồn tại!" });

        var category = new NewsCategory
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            IsActive = request.IsActive,
            CreatedAt = DateTime.Now
        };

        _context.NewsCategories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tạo danh mục tin tức thành công!", category.Id });
    }

    [HttpGet("tags")]
    public async Task<IActionResult> GetTags()
    {
        var tags = await _context.NewsTags
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Slug
            })
            .ToListAsync();

        return Ok(tags);
    }

    [HttpPost("tags")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTag([FromBody] CreateNewsTagRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên thẻ không được để trống!" });

        if (string.IsNullOrWhiteSpace(request.Slug))
            request.Slug = GenerateSlug(request.Name);

        var slugExists = await _context.NewsTags.AnyAsync(x => x.Slug == request.Slug);
        if (slugExists)
            return BadRequest(new { message = "Slug thẻ đã tồn tại!" });

        var tag = new NewsTag
        {
            Name = request.Name,
            Slug = request.Slug,
            CreatedAt = DateTime.Now
        };

        _context.NewsTags.Add(tag);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tạo thẻ thành công!", tag.Id });
    }

    private static string GenerateSlug(string input)
    {
        return input
            .Trim()
            .ToLower()
            .Replace("đ", "d")
            .Replace(" ", "-");
    }
}

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
}

public class CreateNewsCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateNewsTagRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}
