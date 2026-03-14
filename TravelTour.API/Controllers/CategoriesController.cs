using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;
using Microsoft.AspNetCore.Authorization;
namespace TravelTour.API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase {
    private readonly TravelDbContext _context;
    public CategoriesController(TravelDbContext context) => _context = context;

    // 1. GET: api/Categories (LẤY DANH SÁCH)
    [HttpGet] public async Task<ActionResult<IEnumerable<Category>>> Get() => await _context.Categories.ToListAsync();

    // 2. POST: api/Categories (THÊM MỚI)
    [HttpPost] public async Task<ActionResult<Category>> Post(Category item) {
        _context.Categories.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    // 3. PUT: api/Categories/5 (SỬA)
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Category item) {
        if (id != item.Id) return BadRequest();
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // 4. DELETE: api/Categories/5 (XÓA)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var item = await _context.Categories.FindAsync(id);
        if (item == null) return NotFound();
        _context.Categories.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}