using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase 
{
    private readonly TravelDbContext _context;
    public CategoriesController(TravelDbContext context) => _context = context;

    // 1. GET: Lấy danh sách (Cho phép cả khách xem không cần đăng nhập)
    [HttpGet] 
    [AllowAnonymous] 
    public async Task<ActionResult<IEnumerable<Category>>> Get() 
    {
        return await _context.Categories.ToListAsync();
    }

    // 2. POST: Thêm mới (Chỉ Admin)
    [Authorize(Roles = "Admin")]
    [HttpPost] 
    public async Task<ActionResult<Category>> Post(Category item) 
    {
        _context.Categories.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }

    // 3. PUT: Sửa (Chỉ Admin)
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Category item) 
    {
        var categoryInDb = await _context.Categories.FindAsync(id);
        if (categoryInDb == null) return NotFound("Không tìm thấy danh mục.");

        // Cập nhật từng trường để an toàn
        categoryInDb.Name = item.Name;
        categoryInDb.Description = item.Description;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công!" });
    }

    // 4. DELETE: Xóa (Có kiểm tra ràng buộc Tour)
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) 
    {
        var item = await _context.Categories.FindAsync(id);
        if (item == null) return NotFound();

        // Kiểm tra ERD: Nếu có Tour thuộc danh mục này thì không cho xóa
        var hasTours = await _context.Tours.AnyAsync(t => t.CategoryId == id);
        if (hasTours) 
        {
            return BadRequest("Không thể xóa vì danh mục này đang chứa các Tour. Hãy xóa Tour trước!");
        }

        _context.Categories.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa danh mục thành công!" });
    }
}