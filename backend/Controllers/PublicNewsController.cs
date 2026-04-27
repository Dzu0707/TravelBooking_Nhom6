using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;

namespace TravelTour.API.Controllers;

[Route("api/public/news")]
[ApiController]
public class PublicNewsController : ControllerBase
{
    private readonly TravelDbContext _context;
    public PublicNewsController(TravelDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetPublishedNews(
        [FromQuery] string? keyword,
        [FromQuery] int? categoryId,
        [FromQuery] bool? featured,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var query = _context.NewsPosts
            .Include(x => x.Category)
            .Include(x => x.Author)
            .Include(x => x.NewsTagMaps)
                .ThenInclude(x => x.NewsTag)
            .Where(x => x.Status == "Published")
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            query = query.Where(x =>
                x.Title.Contains(keyword) ||
                x.Summary.Contains(keyword) ||
                x.Slug.Contains(keyword));
        }

        if (categoryId.HasValue)
            query = query.Where(x => x.CategoryId == categoryId.Value);

        if (featured.HasValue)
            query = query.Where(x => x.IsFeatured == featured.Value);

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.PublishedAt ?? x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Slug,
                x.Summary,
                x.ThumbnailUrl,
                x.IsFeatured,
                x.ViewCount,
                x.PublishedAt,
                Category = new
                {
                    x.CategoryId,
                    x.Category.Name,
                    x.Category.Slug
                },
                Author = x.Author.FullName,
                Tags = x.NewsTagMaps.Select(t => new
                {
                    t.NewsTagId,
                    t.NewsTag.Name,
                    t.NewsTag.Slug
                }).ToList()
            })
            .ToListAsync();

        return Ok(new
        {
            page,
            pageSize,
            totalItems,
            totalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            items
        });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await _context.NewsPosts
            .Include(x => x.Category)
            .Include(x => x.Author)
            .Include(x => x.NewsTagMaps)
                .ThenInclude(x => x.NewsTag)
            .FirstOrDefaultAsync(x => x.Slug == slug && x.Status == "Published");

        if (post == null)
            return NotFound(new { message = "Không tìm thấy bài viết!" });

        post.ViewCount += 1;
        post.UpdatedAt = DateTime.Now;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            post.Id,
            post.Title,
            post.Slug,
            post.Summary,
            post.Content,
            post.ThumbnailUrl,
            post.IsFeatured,
            post.ViewCount,
            post.PublishedAt,
            post.CreatedAt,
            Category = new
            {
                post.CategoryId,
                post.Category.Name,
                post.Category.Slug
            },
            Author = post.Author.FullName,
            Tags = post.NewsTagMaps.Select(t => new
            {
                t.NewsTagId,
                t.NewsTag.Name,
                t.NewsTag.Slug
            }).ToList()
        });
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetActiveCategories()
    {
        var categories = await _context.NewsCategories
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Slug,
                x.Description
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("featured/latest")]
    public async Task<IActionResult> GetFeaturedLatest([FromQuery] int take = 5)
    {
        if (take <= 0) take = 5;
        if (take > 20) take = 20;

        var items = await _context.NewsPosts
            .Include(x => x.Category)
            .Where(x => x.Status == "Published" && x.IsFeatured)
            .OrderByDescending(x => x.PublishedAt ?? x.CreatedAt)
            .Take(take)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Slug,
                x.Summary,
                x.ThumbnailUrl,
                x.PublishedAt,
                Category = x.Category.Name
            })
            .ToListAsync();

        return Ok(items);
    }
}
