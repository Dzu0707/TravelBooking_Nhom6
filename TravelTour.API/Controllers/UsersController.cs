using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTour.API.Data;
using TravelTour.API.Models;

namespace TravelTour.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase {
    private readonly TravelDbContext _context;
    public UsersController(TravelDbContext context) => _context = context;

    [HttpGet] public async Task<ActionResult<IEnumerable<User>>> Get() => await _context.Users.ToListAsync();
    
    [HttpPost] public async Task<ActionResult<User>> Post(User item) {
        _context.Users.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }
}