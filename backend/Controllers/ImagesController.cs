using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TravelTour.API.Data; // Đảm bảo namespace này khớp với thư mục Data của bạn
using TravelTour.API.Models; // Đảm bảo namespace này khớp với thư mục Models của bạn
using System.IO;

namespace TravelTour.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly TravelDbContext _context;

        public ImagesController(IWebHostEnvironment env, TravelDbContext context)
        {
            _env = env;
            _context = context;
        }

        [HttpPost("upload/{tourId}")]
        public async Task<IActionResult> Upload(int tourId, IFormFile file)
        {
            if (file == null || file.Length == 0) 
                return BadRequest("File không hợp lệ hoặc trống.");

            // 1. Tạo thư mục wwwroot/uploads nếu chưa có
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder)) 
                Directory.CreateDirectory(uploadsFolder);

            // 2. Tạo tên file duy nhất để tránh trùng lặp
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            // 3. Lưu file vật lý vào server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 4. Lưu đường dẫn vào Database (bảng TourImages)
            var tourImage = new TourImage
            {
                TourId = tourId,
                ImageUrl = $"/uploads/{fileName}",
                IsPrimary = false
            };

            _context.TourImages.Add(tourImage);
            await _context.SaveChangesAsync();

            return Ok(new { url = tourImage.ImageUrl, message = "Tải ảnh lên thành công!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.TourImages.FindAsync(id);
            if (image == null) return NotFound();

            // Xóa file vật lý
            var filePath = Path.Combine(_env.WebRootPath, image.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath)) 
                System.IO.File.Exists(filePath);

            _context.TourImages.Remove(image);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa ảnh." });
        }
    }
}