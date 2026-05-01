using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ToursController : ControllerBase
{
    private readonly TravelDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ToursController(TravelDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var tours = await _context.Tours
            .Include(t => t.TourImages)
                .ThenInclude(ti => ti.MediaAsset)
            .Include(t => t.TourSchedules)
            .OrderByDescending(t => t.Id)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                t.CategoryId,
                t.Description,
                t.MinPrice,
                t.CreatedAt,
                ImageUrl = t.TourImages
                    .Where(i => i.IsPrimary)
                    .OrderBy(i => i.SortOrder)
                    .Select(i => i.MediaAsset != null ? i.MediaAsset.FileUrl : null)
                    .FirstOrDefault(),
                TourImages = t.TourImages
                    .OrderBy(i => i.SortOrder)
                    .Select(i => new
                    {
                        i.Id,
                        i.IsPrimary,
                        i.SortOrder,
                        i.MediaAssetId,
                        ImageUrl = i.MediaAsset != null ? i.MediaAsset.FileUrl : null,
                        FileName = i.MediaAsset != null ? i.MediaAsset.FileName : null,
                        AltText = i.MediaAsset != null ? i.MediaAsset.AltText : null
                    }),
                TourSchedules = t.TourSchedules
            })
            .ToListAsync();

        return Ok(tours);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var tour = await _context.Tours
            .Include(t => t.TourImages)
                .ThenInclude(ti => ti.MediaAsset)
            .Include(t => t.TourSchedules)
            .Where(t => t.Id == id)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.Code,
                t.DepartureLocation,
                t.CategoryId,
                t.Description,
                t.MinPrice,
                t.CreatedAt,
                ImageUrl = t.TourImages
                    .Where(i => i.IsPrimary)
                    .OrderBy(i => i.SortOrder)
                    .Select(i => i.MediaAsset != null ? i.MediaAsset.FileUrl : null)
                    .FirstOrDefault(),
                TourImages = t.TourImages
                    .OrderBy(i => i.SortOrder)
                    .Select(i => new
                    {
                        i.Id,
                        i.IsPrimary,
                        i.SortOrder,
                        i.MediaAssetId,
                        ImageUrl = i.MediaAsset != null ? i.MediaAsset.FileUrl : null,
                        FileName = i.MediaAsset != null ? i.MediaAsset.FileName : null,
                        AltText = i.MediaAsset != null ? i.MediaAsset.AltText : null
                    }),
                TourSchedules = t.TourSchedules
            })
            .FirstOrDefaultAsync();

        if (tour == null) return NotFound();
        return Ok(tour);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] TourDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var tour = new Tour
            {
                Name = dto.Name,
                Code = dto.Code,
                DepartureLocation = dto.DepartureLocation,
                CategoryId = dto.CategoryId,
                Description = dto.Description ?? string.Empty,
                MinPrice = dto.AdultPrice,
                CreatedAt = DateTime.Now
            };

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            var sortOrder = 1;
            var hasPrimary = false;

            if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                var media = await CreateMediaAssetFromUrlAsync(dto.ImageUrl);
                _context.TourImages.Add(new TourImage
                {
                    TourId = tour.Id,
                    MediaAssetId = media.Id,
                    IsPrimary = true,
                    SortOrder = sortOrder++
                });
                hasPrimary = true;
            }
            else if (dto.ImageFile != null)
            {
                var uploadedUrl = await UploadProcess(dto.ImageFile);
                var media = await CreateMediaAssetFromUploadAsync(dto.ImageFile.FileName, uploadedUrl);
                _context.TourImages.Add(new TourImage
                {
                    TourId = tour.Id,
                    MediaAssetId = media.Id,
                    IsPrimary = true,
                    SortOrder = sortOrder++
                });
                hasPrimary = true;
            }

            if (dto.AlbumImageUrls != null && dto.AlbumImageUrls.Any())
            {
                foreach (var url in dto.AlbumImageUrls.Where(x => !string.IsNullOrWhiteSpace(x)).Distinct())
                {
                    var media = await CreateMediaAssetFromUrlAsync(url);
                    _context.TourImages.Add(new TourImage
                    {
                        TourId = tour.Id,
                        MediaAssetId = media.Id,
                        IsPrimary = false,
                        SortOrder = sortOrder++
                    });
                }
            }

            if (dto.AlbumFiles != null && dto.AlbumFiles.Any())
            {
                foreach (var file in dto.AlbumFiles)
                {
                    var uploadedUrl = await UploadProcess(file);
                    var media = await CreateMediaAssetFromUploadAsync(file.FileName, uploadedUrl);
                    _context.TourImages.Add(new TourImage
                    {
                        TourId = tour.Id,
                        MediaAssetId = media.Id,
                        IsPrimary = false,
                        SortOrder = sortOrder++
                    });
                }
            }

            if (!hasPrimary)
            {
                return BadRequest(new { message = "Tour phải có ít nhất 1 ảnh chính." });
            }

            _context.TourSchedules.Add(new TourSchedule
            {
                TourId = tour.Id,
                AdultPrice = dto.AdultPrice,
                ChildPrice = dto.ChildPrice,
                DepartureDate = DateTime.Now.AddDays(7),
                ReturnDate = DateTime.Now.AddDays(10),
                Quota = 20,
                AvailableSeats = 20,
                Status = "Available"
            });

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return await GetById(tour.Id);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromForm] TourDto dto)
    {
        var tour = await _context.Tours
            .Include(t => t.TourImages)
                .ThenInclude(ti => ti.MediaAsset)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tour == null) return NotFound();

        tour.Name = dto.Name;
        tour.Code = dto.Code;
        tour.DepartureLocation = dto.DepartureLocation;
        tour.CategoryId = dto.CategoryId;
        tour.Description = dto.Description ?? string.Empty;
        tour.MinPrice = dto.AdultPrice;

        var currentPrimary = tour.TourImages.FirstOrDefault(i => i.IsPrimary);

        if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
        {
            var media = await CreateMediaAssetFromUrlAsync(dto.ImageUrl);

            if (currentPrimary != null)
            {
                currentPrimary.MediaAssetId = media.Id;
            }
            else
            {
                _context.TourImages.Add(new TourImage
                {
                    TourId = id,
                    MediaAssetId = media.Id,
                    IsPrimary = true,
                    SortOrder = 1
                });
            }
        }
        else if (dto.ImageFile != null)
        {
            var uploadedUrl = await UploadProcess(dto.ImageFile);
            var media = await CreateMediaAssetFromUploadAsync(dto.ImageFile.FileName, uploadedUrl);

            if (currentPrimary != null)
            {
                currentPrimary.MediaAssetId = media.Id;
            }
            else
            {
                _context.TourImages.Add(new TourImage
                {
                    TourId = id,
                    MediaAssetId = media.Id,
                    IsPrimary = true,
                    SortOrder = 1
                });
            }
        }

        var maxSortOrder = tour.TourImages.Any() ? tour.TourImages.Max(x => x.SortOrder) : 0;

        if (dto.AlbumImageUrls != null && dto.AlbumImageUrls.Any())
        {
            foreach (var url in dto.AlbumImageUrls.Where(x => !string.IsNullOrWhiteSpace(x)).Distinct())
            {
                var exists = tour.TourImages.Any(img =>
                    img.MediaAsset != null &&
                    img.MediaAsset.FileUrl == url);

                if (!exists)
                {
                    var media = await CreateMediaAssetFromUrlAsync(url);
                    _context.TourImages.Add(new TourImage
                    {
                        TourId = id,
                        MediaAssetId = media.Id,
                        IsPrimary = false,
                        SortOrder = ++maxSortOrder
                    });
                }
            }
        }

        if (dto.AlbumFiles != null && dto.AlbumFiles.Any())
        {
            foreach (var file in dto.AlbumFiles)
            {
                var uploadedUrl = await UploadProcess(file);
                var media = await CreateMediaAssetFromUploadAsync(file.FileName, uploadedUrl);

                _context.TourImages.Add(new TourImage
                {
                    TourId = id,
                    MediaAssetId = media.Id,
                    IsPrimary = false,
                    SortOrder = ++maxSortOrder
                });
            }
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Lỗi khi lưu: " + ex.Message });
        }

        return await GetById(id);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var tour = await _context.Tours
            .Include(t => t.TourImages)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tour == null) return NotFound();

        _context.Tours.Remove(tour);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<string> UploadProcess(IFormFile file)
    {
        var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var path = Path.Combine(wwwPath, "uploads", "tours");

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var fullPath = Path.Combine(path, fileName);

        using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/uploads/tours/{fileName}";
    }

    private async Task<MediaAsset> CreateMediaAssetFromUrlAsync(string url)
    {
        var normalizedUrl = url.Trim();

        var existing = await _context.MediaAssets
            .FirstOrDefaultAsync(x => x.FileUrl == normalizedUrl);

        if (existing != null)
        {
            return existing;
        }

        var media = new MediaAsset
        {
            FileName = Path.GetFileName(normalizedUrl),
            FileUrl = normalizedUrl,
            AltText = Path.GetFileNameWithoutExtension(normalizedUrl),
            UploadedById = GetCurrentUserId(),
            CreatedAt = DateTime.Now
        };

        _context.MediaAssets.Add(media);
        await _context.SaveChangesAsync();
        return media;
    }

    private async Task<MediaAsset> CreateMediaAssetFromUploadAsync(string originalFileName, string fileUrl)
    {
        var media = new MediaAsset
        {
            FileName = Path.GetFileName(originalFileName),
            FileUrl = fileUrl,
            AltText = Path.GetFileNameWithoutExtension(originalFileName),
            UploadedById = GetCurrentUserId(),
            CreatedAt = DateTime.Now
        };

        _context.MediaAssets.Add(media);
        await _context.SaveChangesAsync();
        return media;
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var userId) ? userId : 10;
    }
}

public class TourDto
{
    public string Name { get; set; } = "";
    public string Code { get; set; } = "";
    public string DepartureLocation { get; set; } = "";
    public int CategoryId { get; set; }
    public string? Description { get; set; }
    public decimal AdultPrice { get; set; }
    public decimal ChildPrice { get; set; }
    public string? ImageUrl { get; set; }
    public List<string>? AlbumImageUrls { get; set; }
    public IFormFile? ImageFile { get; set; }
    public List<IFormFile>? AlbumFiles { get; set; }
}
