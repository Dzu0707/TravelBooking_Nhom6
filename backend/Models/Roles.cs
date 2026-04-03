namespace TravelTour.API.Models;

public class Role {
    public int Id { get; set; }
    
    // Ví dụ: "Admin", "User", "Staff"
    public string Name { get; set; } = string.Empty;

    // Navigation Property: Một Role có thể có nhiều Users (Quan hệ 1-N)
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}