using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFinalSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Khám phá sông nước miệt vườn", "Du lịch Miền Tây" },
                    { 2, "Nghỉ dưỡng tại các bãi biển đẹp", "Du lịch Biển Đảo" },
                    { 3, "Trải nghiệm không khí vùng cao", "Du lịch Núi" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsLocked", "PasswordHash", "Phone", "RoleId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@travel.com", "Nguyễn Admin", false, "hashed_password", "0338083908", 1 },
                    { 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "user@gmail.com", "Trần Khách Hàng", false, "hashed_password", "0879390378", 2 }
                });

            migrationBuilder.InsertData(
                table: "Vouchers",
                columns: new[] { "Id", "Code", "DiscountType", "DiscountValue", "ExpiryDate", "Quantity" },
                values: new object[,]
                {
                    { 1, "WELCOME2026", "Percentage", 10m, new DateTime(2026, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 100 },
                    { 2, "GIAM500K", "FixedAmount", 500000m, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 50 }
                });

            migrationBuilder.InsertData(
                table: "Tours",
                columns: new[] { "Id", "CategoryId", "Code", "CreatedAt", "DepartureLocation", "Description", "ImageUrl", "MinPrice", "Name" },
                values: new object[,]
                {
                    { 1, 1, "LA001", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Trải nghiệm khu đô thị sinh thái", null, 2500000m, "Tour LA Home Long An" },
                    { 2, 2, "PQ002", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Lặn ngắm san hô", null, 5000000m, "Tour Phú Quốc Đảo Ngọc" }
                });

            migrationBuilder.InsertData(
                table: "TourImages",
                columns: new[] { "Id", "ImageUrl", "IsPrimary", "TourId" },
                values: new object[,]
                {
                    { 1, "lahome_main.jpg", true, 1 },
                    { 2, "phuquoc_beach.jpg", true, 2 }
                });

            migrationBuilder.InsertData(
                table: "TourSchedules",
                columns: new[] { "Id", "AdultPrice", "AvailableSeats", "ChildPrice", "DepartureDate", "Quota", "ReturnDate", "Status", "TourId" },
                values: new object[,]
                {
                    { 1, 2500000m, 28, 1800000m, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 30, new DateTime(2026, 5, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 1 },
                    { 2, 5000000m, 15, 3500000m, new DateTime(2026, 6, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 6, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 2 }
                });

            migrationBuilder.InsertData(
                table: "Bookings",
                columns: new[] { "Id", "CreatedAt", "Status", "TotalPassengers", "TotalPrice", "TourScheduleId", "UserId", "VoucherId" },
                values: new object[] { 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Confirmed", 2, 5000000m, 1, 2, 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Bookings",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TourImages",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TourImages",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "TourSchedules",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TourSchedules",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Tours",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Tours",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Vouchers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Vouchers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
