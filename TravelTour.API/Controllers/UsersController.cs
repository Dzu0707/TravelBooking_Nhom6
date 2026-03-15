using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // Fix CS0246
using TravelTour.API.Data;
using TravelTour.API.Models;
using System.Security.Claims;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")] // Fix CS0246/CS0246
public class UsersController : ControllerBase 
{
    private readonly TravelDbContext _context;
    public UsersController(TravelDbContext context) => _context = context;

    [HttpGet] 
    public async Task<IActionResult> Get() 
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Select(u => new {
                u.Id,
                u.FullName,
                u.Email,
                u.Phone,
                u.IsLocked,
                u.CreatedAt
            })
            .ToListAsync();
        return Ok(users);
    }
    
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile() 
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == userEmail);
            
        if (user == null) return NotFound();

        return Ok(new { 
            user.FullName, 
            user.Email, 
            user.Phone 
        });
    }
}