using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;
using Microsoft.AspNetCore.Authorization;

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
            .Include(t => t.TourSchedules)
            .OrderByDescending(t => t.Id)
            .ToListAsync();

        return Ok(tours);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var tour = await _context.Tours
            .Include(t => t.TourImages)
            .Include(t => t.TourSchedules)
            .FirstOrDefaultAsync(t => t.Id == id);

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
            var mainImageUrl = "/uploads/tours/default.jpg";

            if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                mainImageUrl = dto.ImageUrl;
            }
            else if (dto.ImageFile != null)
            {
                mainImageUrl = await UploadProcess(dto.ImageFile);
            }

            var tour = new Tour
            {
                Name = dto.Name,
                Code = dto.Code,
                DepartureLocation = dto.DepartureLocation,
                CategoryId = dto.CategoryId,
                Description = dto.Description ?? "",
                CreatedAt = DateTime.Now,
                ImageUrl = mainImageUrl
            };

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            if (dto.AlbumImageUrls != null && dto.AlbumImageUrls.Any())
            {
                foreach (var url in dto.AlbumImageUrls
                             .Where(x => !string.IsNullOrWhiteSpace(x))
                             .Distinct())
                {
                    _context.TourImages.Add(new TourImage
                    {
                        TourId = tour.Id,
                        ImageUrl = url
                    });
                }
            }
            else if (dto.AlbumFiles != null && dto.AlbumFiles.Any())
            {
                foreach (var file in dto.AlbumFiles)
                {
                    var path = await UploadProcess(file);
                    _context.TourImages.Add(new TourImage
                    {
                        TourId = tour.Id,
                        ImageUrl = path
                    });
                }
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

            var result = await _context.Tours
                .Include(t => t.TourImages)
                .FirstOrDefaultAsync(t => t.Id == tour.Id);

            return Ok(result);
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
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tour == null) return NotFound();

        tour.Name = dto.Name;
        tour.Code = dto.Code;
        tour.DepartureLocation = dto.DepartureLocation;
        tour.CategoryId = dto.CategoryId;
        tour.Description = dto.Description ?? "";

        if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
        {
            tour.ImageUrl = dto.ImageUrl;
        }
        else if (dto.ImageFile != null)
        {
            DeletePhysicalFile(tour.ImageUrl);
            tour.ImageUrl = await UploadProcess(dto.ImageFile);
        }

        if (dto.AlbumImageUrls != null && dto.AlbumImageUrls.Any())
        {
            foreach (var url in dto.AlbumImageUrls
                         .Where(x => !string.IsNullOrWhiteSpace(x))
                         .Distinct())
            {
                var exists = tour.TourImages != null && tour.TourImages.Any(img => img.ImageUrl == url);
                if (!exists)
                {
                    _context.TourImages.Add(new TourImage
                    {
                        TourId = id,
                        ImageUrl = url
                    });
                }
            }
        }
        else if (dto.AlbumFiles != null && dto.AlbumFiles.Any())
        {
            foreach (var file in dto.AlbumFiles)
            {
                var path = await UploadProcess(file);
                _context.TourImages.Add(new TourImage
                {
                    TourId = id,
                    ImageUrl = path
                });
            }
        }

        await _context.SaveChangesAsync();

        var updatedTour = await _context.Tours
            .Include(t => t.TourImages)
            .FirstOrDefaultAsync(t => t.Id == id);

        return Ok(updatedTour);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var tour = await _context.Tours
            .Include(t => t.TourImages)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tour == null) return NotFound();

        DeletePhysicalFile(tour.ImageUrl);

        if (tour.TourImages != null)
        {
            foreach (var img in tour.TourImages)
            {
                DeletePhysicalFile(img.ImageUrl);
            }
        }

        _context.Tours.Remove(tour);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<string> UploadProcess(IFormFile file)
    {
        var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var path = Path.Combine(wwwPath, "uploads", "tours");
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var fullPath = Path.Combine(path, fileName);

        using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/uploads/tours/{fileName}";
    }

    private void DeletePhysicalFile(string? path)
    {
        if (string.IsNullOrEmpty(path) || path.Contains("default.jpg") || !path.StartsWith("/"))
            return;

        if (path.StartsWith("/uploads/media/", StringComparison.OrdinalIgnoreCase))
            return;

        var wwwPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var fullPath = Path.Combine(wwwPath, path.TrimStart('/'));

        if (System.IO.File.Exists(fullPath))
        {
            try
            {
                System.IO.File.Delete(fullPath);
            }
            catch
            {
            }
        }
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
