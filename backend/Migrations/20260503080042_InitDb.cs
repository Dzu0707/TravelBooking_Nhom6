using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NewsCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NewsTags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsTags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiscountType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiscountValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartureLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tours_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvatarUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CoverUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsLocked = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResetPasswordToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResetPasswordTokenExpiry = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TourId = table.Column<int>(type: "int", nullable: false),
                    DepartureDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AdultPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ChildPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quota = table.Column<int>(type: "int", nullable: false),
                    AvailableSeats = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourSchedules_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MediaAssets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AltText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UploadedById = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaAssets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MediaAssets_Users_UploadedById",
                        column: x => x.UploadedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NewsPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    AuthorId = table.Column<int>(type: "int", nullable: false),
                    PublishedById = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    ViewCount = table.Column<int>(type: "int", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NewsPosts_NewsCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "NewsCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NewsPosts_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NewsPosts_Users_PublishedById",
                        column: x => x.PublishedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TourId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TourScheduleId = table.Column<int>(type: "int", nullable: false),
                    VoucherId = table.Column<int>(type: "int", nullable: true),
                    ContactName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpecialRequest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdultCount = table.Column<int>(type: "int", nullable: false),
                    ChildCount = table.Column<int>(type: "int", nullable: false),
                    TotalPassengers = table.Column<int>(type: "int", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_TourSchedules_TourScheduleId",
                        column: x => x.TourScheduleId,
                        principalTable: "TourSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Vouchers_VoucherId",
                        column: x => x.VoucherId,
                        principalTable: "Vouchers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TourImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TourId = table.Column<int>(type: "int", nullable: false),
                    MediaAssetId = table.Column<int>(type: "int", nullable: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourImages_MediaAssets_MediaAssetId",
                        column: x => x.MediaAssetId,
                        principalTable: "MediaAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TourImages_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NewsTagMaps",
                columns: table => new
                {
                    NewsPostId = table.Column<int>(type: "int", nullable: false),
                    NewsTagId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsTagMaps", x => new { x.NewsPostId, x.NewsTagId });
                    table.ForeignKey(
                        name: "FK_NewsTagMaps_NewsPosts_NewsPostId",
                        column: x => x.NewsPostId,
                        principalTable: "NewsPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsTagMaps_NewsTags_NewsTagId",
                        column: x => x.NewsTagId,
                        principalTable: "NewsTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingAttendees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingAttendees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingAttendees_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    TransactionCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Các tour biển, đảo và nghỉ dưỡng ven biển.", "Tour Biển - Đảo" },
                    { 2, "Khám phá núi rừng, cao nguyên và khí hậu mát mẻ.", "Tour Núi - Cao nguyên" },
                    { 3, "Hành trình di sản, lịch sử và văn hóa bản địa.", "Tour Di sản - Văn hóa" },
                    { 4, "Trải nghiệm miền Tây, chợ nổi và văn hóa sông nước.", "Tour Miền Tây - Sông nước" },
                    { 5, "Hang động, cảnh quan tự nhiên và điểm đến độc đáo.", "Tour Thiên nhiên - Khám phá" }
                });

            migrationBuilder.InsertData(
                table: "NewsCategories",
                columns: new[] { "Id", "CreatedAt", "Description", "IsActive", "Name", "Slug" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Tin du lịch", "tin-du-lich" },
                    { 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Khuyến mãi", "khuyen-mai" },
                    { 3, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Kinh nghiệm", "kinh-nghiem" },
                    { 4, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Ẩm thực", "am-thuc" },
                    { 5, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Check-in", "check-in" },
                    { 6, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Review", "review" },
                    { 7, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Tips", "tips" },
                    { 8, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Tin hot", "tin-hot" },
                    { 9, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Du lịch quốc tế", "du-lich-qt" },
                    { 10, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, "Blog", "blog" }
                });

            migrationBuilder.InsertData(
                table: "NewsTags",
                columns: new[] { "Id", "CreatedAt", "Name", "Slug" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Du lịch biển", "du-lich-bien" },
                    { 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Du lịch núi", "du-lich-nui" },
                    { 3, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ẩm thực", "am-thuc" },
                    { 4, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kinh nghiệm", "kinh-nghiem" },
                    { 5, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Check-in đẹp", "check-in-dep" },
                    { 6, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Review tour", "review-tour" },
                    { 7, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Phượt", "phuot" },
                    { 8, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Resort", "resort" },
                    { 9, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gia đình", "gia-dinh" },
                    { 10, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Khuyến mãi", "khuyen-mai" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "User" }
                });

            migrationBuilder.InsertData(
                table: "Vouchers",
                columns: new[] { "Id", "Code", "DiscountType", "DiscountValue", "ExpiryDate", "Quantity" },
                values: new object[,]
                {
                    { 1, "SUMMER10", "Percentage", 10m, new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 120 },
                    { 2, "SALE200K", "FixedAmount", 200000m, new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 80 },
                    { 3, "NEWUSER", "Percentage", 15m, new DateTime(2026, 10, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 300 },
                    { 4, "VIP500K", "FixedAmount", 500000m, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 25 },
                    { 5, "HOLIDAY20", "Percentage", 20m, new DateTime(2026, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 60 },
                    { 6, "FLASH100K", "FixedAmount", 100000m, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 100 },
                    { 7, "WEEKEND5", "Percentage", 5m, new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 150 },
                    { 8, "TRAVEL50K", "FixedAmount", 50000m, new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 200 },
                    { 9, "FAMILY12", "Percentage", 12m, new DateTime(2026, 9, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 70 },
                    { 10, "LASTMIN8", "Percentage", 8m, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 40 }
                });

            migrationBuilder.InsertData(
                table: "Tours",
                columns: new[] { "Id", "CategoryId", "Code", "CreatedAt", "DepartureLocation", "Description", "MinPrice", "Name" },
                values: new object[,]
                {
                    { 1, 1, "TOUR001", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Biển xanh hoang sơ và di tích lịch sử Côn Đảo.", 4200000m, "Tour Côn Đảo" },
                    { 2, 1, "TOUR002", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Nghỉ dưỡng đảo ngọc với bãi biển trong xanh.", 3900000m, "Tour Phú Quốc" },
                    { 3, 1, "TOUR003", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Khám phá thành phố biển sôi động.", 3600000m, "Tour Nha Trang" },
                    { 4, 1, "TOUR004", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Gành Đá Đĩa và vẻ đẹp bình yên xứ Nẫu.", 3200000m, "Tour Phú Yên" },
                    { 5, 1, "TOUR005", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Du thuyền và kỳ quan thiên nhiên thế giới.", 4100000m, "Tour Vịnh Hạ Long" },
                    { 6, 1, "TOUR006", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Biển Mỹ Khê, Bà Nà và thành phố đáng sống.", 3700000m, "Tour Đà Nẵng" },
                    { 7, 1, "TOUR007", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Kỳ Co - Eo Gió và biển xanh trong.", 3400000m, "Tour Quy Nhơn" },
                    { 8, 1, "TOUR008", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Vịnh Vĩnh Hy, nho Ninh Thuận.", 3300000m, "Tour Ninh Thuận" },
                    { 9, 1, "TOUR009", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Mũi Né, đồi cát và resort biển.", 2800000m, "Tour Phan Thiết" },
                    { 10, 2, "TOUR010", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Thành phố ngàn hoa mộng mơ.", 2900000m, "Tour Đà Lạt" },
                    { 11, 2, "TOUR011", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Đồi chè, mùa hoa và bản làng.", 3100000m, "Tour Mộc Châu" },
                    { 12, 2, "TOUR012", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Fansipan, bản Cát Cát và mây núi.", 3500000m, "Tour Sa Pa" },
                    { 13, 2, "TOUR013", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Cao nguyên đá và cung đường đèo hùng vĩ.", 3800000m, "Tour Hà Giang" },
                    { 14, 2, "TOUR014", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Thủ phủ cà phê và văn hóa Tây Nguyên.", 3000000m, "Tour Buôn Ma Thuột" },
                    { 15, 2, "TOUR015", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Thác Bản Giốc và non nước biên cương.", 3600000m, "Tour Cao Bằng" },
                    { 16, 3, "TOUR016", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đà Nẵng", "Cố đô Huế và quần thể di tích triều Nguyễn.", 2700000m, "Tour Huế" },
                    { 17, 3, "TOUR017", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Tràng An, Hoa Lư và Tam Cốc.", 2600000m, "Tour Ninh Bình" },
                    { 18, 4, "TOUR018", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Chợ nổi Cái Răng và miền sông nước.", 2400000m, "Tour Cần Thơ" },
                    { 19, 4, "TOUR019", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Núi Bà Đen và văn hóa tín ngưỡng.", 2200000m, "Tour Tây Ninh" },
                    { 20, 5, "TOUR020", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Đảo tiền tiêu yên bình, nước biển trong.", 3400000m, "Tour Đảo Phú Quý" },
                    { 21, 5, "TOUR021", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đà Nẵng", "Phong Nha - Kẻ Bàng và động Thiên Đường.", 3600000m, "Tour Quảng Bình" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CoverUrl", "CreatedAt", "Email", "FullName", "IsLocked", "PasswordHash", "Phone", "ResetPasswordToken", "ResetPasswordTokenExpiry", "RoleId" },
                values: new object[,]
                {
                    { 1, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "minhanh.nguyen@gmail.com", "Nguyễn Minh Anh", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0903123456", null, null, 2 },
                    { 2, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "thuhang.tran@gmail.com", "Trần Thu Hằng", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0912233445", null, null, 2 },
                    { 3, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "quoccuong.le@gmail.com", "Lê Quốc Cường", true, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0987654321", null, null, 2 },
                    { 4, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "ngocdiem.pham@gmail.com", "Phạm Ngọc Diễm", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0938345678", null, null, 2 },
                    { 5, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "giabao.hoang@gmail.com", "Hoàng Gia Bảo", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0977123456", null, null, 2 },
                    { 6, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "khanhlinh.do@gmail.com", "Đỗ Khánh Linh", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0909988776", null, null, 2 },
                    { 7, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "thanhnam.vo@gmail.com", "Võ Thành Nam", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0945566778", null, null, 2 },
                    { 8, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "haiyen.bui@gmail.com", "Bùi Hải Yến", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0923123123", null, null, 2 },
                    { 9, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "duclong.ngo@gmail.com", "Ngô Đức Long", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0968877665", null, null, 2 },
                    { 10, null, null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@travel.com", "Admin", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0999999999", null, null, 1 }
                });

            migrationBuilder.InsertData(
                table: "MediaAssets",
                columns: new[] { "Id", "AltText", "CreatedAt", "FileName", "FileUrl", "UploadedById" },
                values: new object[,]
                {
                    { 1, "BuonMaThuot", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "BuonMaThuot.webp", "/uploads/media/BuonMaThuot.webp", 10 },
                    { 2, "BuonMaThuot 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "BuonMaThuot1.webp", "/uploads/media/BuonMaThuot1.webp", 10 },
                    { 3, "BuonMaThuot 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "BuonMaThuot2.webp", "/uploads/media/BuonMaThuot2.webp", 10 },
                    { 4, "CanTho", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "CanTho.webp", "/uploads/media/CanTho.webp", 10 },
                    { 5, "CanTho 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "CanTho1.webp", "/uploads/media/CanTho1.webp", 10 },
                    { 6, "CanTho 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "CanTho2.webp", "/uploads/media/CanTho2.webp", 10 },
                    { 7, "CaoBang", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "CaoBang.webp", "/uploads/media/CaoBang.webp", 10 },
                    { 8, "CaoBang 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "CaoBang1.webp", "/uploads/media/CaoBang1.webp", 10 },
                    { 9, "CaoBang 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "CaoBang2.webp", "/uploads/media/CaoBang2.webp", 10 },
                    { 10, "ConDao", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "ConDao.webp", "/uploads/media/ConDao.webp", 10 },
                    { 11, "ConDao 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "ConDao1.webp", "/uploads/media/ConDao1.webp", 10 },
                    { 12, "ConDao 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "ConDao2.webp", "/uploads/media/ConDao2.webp", 10 },
                    { 13, "DaLat", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaLat.webp", "/uploads/media/DaLat.webp", 10 },
                    { 14, "DaLat 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaLat1.webp", "/uploads/media/DaLat1.webp", 10 },
                    { 15, "DaLat 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaLat2.webp", "/uploads/media/DaLat2.webp", 10 },
                    { 16, "DaNang", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaNang.webp", "/uploads/media/DaNang.webp", 10 },
                    { 17, "DaNang 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaNang1.webp", "/uploads/media/DaNang1.webp", 10 },
                    { 18, "DaNang 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaNang2.webp", "/uploads/media/DaNang2.webp", 10 },
                    { 19, "DaoPhuQuy", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaoPhuQuy.webp", "/uploads/media/DaoPhuQuy.webp", 10 },
                    { 20, "DaoPhuQuy 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaoPhuQuy1.webp", "/uploads/media/DaoPhuQuy1.webp", 10 },
                    { 21, "DaoPhuQuy 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaoPhuQuy2.webp", "/uploads/media/DaoPhuQuy2.webp", 10 },
                    { 22, "HaGiang", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "HaGiang.webp", "/uploads/media/HaGiang.webp", 10 },
                    { 23, "HaGiang 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "HaGiang1.webp", "/uploads/media/HaGiang1.webp", 10 },
                    { 24, "HaGiang 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "HaGiang2.webp", "/uploads/media/HaGiang2.webp", 10 },
                    { 25, "Hue", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hue.webp", "/uploads/media/Hue.webp", 10 },
                    { 26, "Hue 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hue1.webp", "/uploads/media/Hue1.webp", 10 },
                    { 27, "Hue 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hue2.webp", "/uploads/media/Hue2.webp", 10 },
                    { 28, "MocChau", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "MocChau.webp", "/uploads/media/MocChau.webp", 10 },
                    { 29, "MocChau 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "MocChau1.webp", "/uploads/media/MocChau1.webp", 10 },
                    { 30, "MocChau 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "MocChau2.webp", "/uploads/media/MocChau2.webp", 10 },
                    { 31, "NhaTrang", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NhaTrang.webp", "/uploads/media/NhaTrang.webp", 10 },
                    { 32, "NhaTrang 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NhaTrang1.webp", "/uploads/media/NhaTrang1.webp", 10 },
                    { 33, "NhaTrang 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NhaTrang2.webp", "/uploads/media/NhaTrang2.webp", 10 },
                    { 34, "NinhBinh", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NinhBinh.webp", "/uploads/media/NinhBinh.webp", 10 },
                    { 35, "NinhBinh 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NinhBinh1.webp", "/uploads/media/NinhBinh1.webp", 10 },
                    { 36, "NinhBinh 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NinhBinh2.webp", "/uploads/media/NinhBinh2.webp", 10 },
                    { 37, "NinhThuan", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NinhThuan.webp", "/uploads/media/NinhThuan.webp", 10 },
                    { 38, "NinhThuan 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NinhThuan1.webp", "/uploads/media/NinhThuan1.webp", 10 },
                    { 39, "NinhThuan 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NinhThuan2.webp", "/uploads/media/NinhThuan2.webp", 10 },
                    { 40, "PhanThiet", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhanThiet.webp", "/uploads/media/PhanThiet.webp", 10 },
                    { 41, "PhanThiet 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhanThiet1.webp", "/uploads/media/PhanThiet1.webp", 10 },
                    { 42, "PhanThiet 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhanThiet2.webp", "/uploads/media/PhanThiet2.webp", 10 },
                    { 43, "PhuQuoc", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuQuoc.webp", "/uploads/media/PhuQuoc.webp", 10 },
                    { 44, "PhuQuoc 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuQuoc1.webp", "/uploads/media/PhuQuoc1.webp", 10 },
                    { 45, "PhuQuoc 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuQuoc2.webp", "/uploads/media/PhuQuoc2.webp", 10 },
                    { 46, "PhuYen", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuYen.webp", "/uploads/media/PhuYen.webp", 10 },
                    { 47, "PhuYen 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuYen1.webp", "/uploads/media/PhuYen1.webp", 10 },
                    { 48, "PhuYen 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuYen2.webp", "/uploads/media/PhuYen2.webp", 10 },
                    { 49, "QuangBinh", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "QuangBinh.webp", "/uploads/media/QuangBinh.webp", 10 },
                    { 50, "QuangBinh 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "QuangBinh1.webp", "/uploads/media/QuangBinh1.webp", 10 },
                    { 51, "QuangBinh 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "QuangBinh2.webp", "/uploads/media/QuangBinh2.webp", 10 },
                    { 52, "QuyNhon", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "QuyNhon.webp", "/uploads/media/QuyNhon.webp", 10 },
                    { 53, "QuyNhon 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "QuyNhon1.webp", "/uploads/media/QuyNhon1.webp", 10 },
                    { 54, "QuyNhon 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "QuyNhon2.webp", "/uploads/media/QuyNhon2.webp", 10 },
                    { 55, "Sapa", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sapa.webp", "/uploads/media/Sapa.webp", 10 },
                    { 56, "Sapa 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sapa1.webp", "/uploads/media/Sapa1.webp", 10 },
                    { 57, "Sapa 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sapa2.webp", "/uploads/media/Sapa2.webp", 10 },
                    { 58, "TayNinh", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TayNinh.webp", "/uploads/media/TayNinh.webp", 10 },
                    { 59, "TayNinh 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TayNinh1.webp", "/uploads/media/TayNinh1.webp", 10 },
                    { 60, "TayNinh 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TayNinh2.webp", "/uploads/media/TayNinh2.webp", 10 },
                    { 61, "VinhHaLongLong", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VinhHaLongLong.webp", "/uploads/media/VinhHaLongLong.webp", 10 },
                    { 62, "VinhHaLongLong 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VinhHaLongLong1.webp", "/uploads/media/VinhHaLongLong1.webp", 10 },
                    { 63, "VinhHaLongLong 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VinhHaLongLong2.webp", "/uploads/media/VinhHaLongLong2.webp", 10 }
                });

            migrationBuilder.InsertData(
                table: "NewsPosts",
                columns: new[] { "Id", "AuthorId", "CategoryId", "Content", "CreatedAt", "IsFeatured", "PublishedAt", "PublishedById", "Slug", "Status", "Summary", "ThumbnailUrl", "Title", "UpdatedAt", "ViewCount" },
                values: new object[,]
                {
                    { 1, 1, 1, "Từ cáp treo Hòn Thơm, lặn ngắm san hô đến sunset thị trấn Hoàng Hôn — Phú Quốc có đủ trải nghiệm nghỉ dưỡng và vui chơi cho cả gia đình.", new DateTime(2026, 4, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "top-7-trai-nghiem-phu-quoc-mua-he", "Published", "Lịch trình 3N2Đ khám phá đảo ngọc với chi phí tối ưu.", "/uploads/media/PhuQuoc.webp", "Top 7 trải nghiệm không thể bỏ lỡ ở Phú Quốc mùa hè", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 2180 },
                    { 2, 2, 3, "Ngày 1 dạo biển và trung tâm thành phố, ngày 2 đi Bà Nà Hills, ngày 3 kết hợp Hội An là lịch trình hợp lý cho nhóm bạn hoặc gia đình.", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "da-nang-3n2d-lich-trinh-goi-y", "Published", "Biển Mỹ Khê, Bà Nà, Hội An trong một hành trình vừa sức.", "/uploads/media/DaNang.webp", "Đà Nẵng 3N2Đ: lịch trình gọn đẹp cho người đi lần đầu", new DateTime(2026, 4, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 1960 },
                    { 3, 3, 4, "Nha Trang không chỉ có biển đẹp mà còn nổi tiếng bởi văn hóa ẩm thực đa dạng, giá hợp lý và dễ tìm quanh khu trung tâm.", new DateTime(2026, 4, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "an-gi-o-nha-trang-10-mon-nen-thu", "Published", "Bún sứa, bánh căn, hải sản đêm và quán local chất lượng.", "/uploads/media/NhaTrang2.webp", "Ăn gì ở Nha Trang? 10 món địa phương nên thử", new DateTime(2026, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 1510 },
                    { 4, 4, 5, "Phú Yên phù hợp cho chuyến đi ngắn 2N1Đ với nhịp độ chậm, cảnh đẹp tự nhiên và nhiều điểm check-in sát biển.", new DateTime(2026, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "phu-yen-cuoi-tuan-goi-y-diem-den", "Published", "Gành Đá Đĩa, Bãi Xép, cung đường ven biển cực chill.", "/uploads/media/PhuYen1.webp", "Phú Yên cuối tuần: đi đâu để có ảnh đẹp mà không quá đông?", new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 1320 },
                    { 5, 5, 6, "Nếu muốn nghỉ ngơi, đi tour trọn gói sẽ tiết kiệm thời gian. Nếu thích chủ động check-in, bạn có thể tự túc kết hợp du thuyền ngày.", new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "vinh-ha-long-tu-tuc-hay-di-tour", "Published", "So sánh chi phí, trải nghiệm và độ tiện lợi cho từng lựa chọn.", "/uploads/media/VinhHaLongLong.webp", "Vịnh Hạ Long nên đi tự túc hay đi tour?", new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 1850 },
                    { 6, 6, 3, "Đà Lạt có nét đẹp riêng mỗi mùa: đầu năm hoa nở rực rỡ, giữa năm xanh mát, cuối năm thời tiết lạnh và phù hợp săn mây buổi sớm.", new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "da-lat-thang-nao-dep-nhat", "Published", "Mùa hoa, mùa mưa và thời điểm săn mây lý tưởng.", "/uploads/media/DaLat1.webp", "Đà Lạt tháng nào đẹp nhất? Gợi ý theo từng mùa", new DateTime(2026, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 2100 },
                    { 7, 7, 7, "Nhiệt độ Sa Pa chênh lệch ngày đêm lớn, nên chuẩn bị áo khoác chống gió, giày bám tốt và kế hoạch di chuyển linh hoạt theo thời tiết.", new DateTime(2026, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "sapa-mua-may-checklist-can-mang", "Published", "Trang phục, thuốc cơ bản, giày trekking và mẹo giữ ấm.", "/uploads/media/Sapa.webp", "Sa Pa mùa mây: checklist đồ cần mang theo", new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 1240 },
                    { 8, 8, 7, "Không chạy đêm, kiểm tra phanh/lốp trước khi đi, luôn mang giấy tờ và theo dõi dự báo thời tiết là các nguyên tắc quan trọng nhất.", new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "ha-giang-8-luu-y-an-toan-xe-may", "Published", "Kinh nghiệm thực tế cho người mới đi cung đèo.", "/uploads/media/HaGiang1.webp", "Hà Giang an toàn hơn khi đi xe máy: 8 lưu ý bắt buộc", new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 1730 },
                    { 9, 9, 3, "Mộc Châu đẹp nhất khi hoa nở trắng đồi. Bạn có thể kết hợp đồi chè trái tim, rừng thông và các bản làng văn hóa.", new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "moc-chau-mua-hoa-man-kinh-nghiem", "Published", "Combo điểm đến + homestay + món ngon địa phương.", "/uploads/media/MocChau.webp", "Mộc Châu mùa hoa mận: đi đâu, ăn gì, ở đâu?", new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 980 },
                    { 10, 1, 6, "Khám phá làng cà phê, bảo tàng thế giới cà phê và các điểm thác nổi bật quanh thành phố là lựa chọn rất đáng thử.", new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "buon-ma-thuot-2n1d-goi-y", "Published", "Hành trình ngắn gọn nhưng đủ trải nghiệm đặc trưng.", "/uploads/media/BuonMaThuot.webp", "Buôn Ma Thuột 2N1Đ: cà phê, thác nước và văn hóa Tây Nguyên", new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 860 },
                    { 11, 2, 5, "Cao Bằng phù hợp với ai thích thiên nhiên hùng vĩ. Bạn nên lên kế hoạch sớm để có lịch trình hợp lý và tiết kiệm thời gian di chuyển.", new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "cao-bang-ban-gioc-kinh-nghiem-tu-tuc", "Published", "Kinh nghiệm di chuyển xa, đặt phòng và ăn uống vùng cao.", "/uploads/media/CaoBang.webp", "Cao Bằng và thác Bản Giốc: đi tự túc cần chuẩn bị gì?", new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 910 },
                    { 12, 3, 1, "Ngoài Đại Nội, Huế còn hấp dẫn bởi lăng tẩm, phố cổ, ẩm thực cung đình và không gian đậm chất văn hóa miền Trung.", new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "hue-6-trai-nghiem-nen-thu", "Published", "Ẩm thực, di sản, nhịp sống chậm đầy chiều sâu.", "/uploads/media/Hue.webp", "Huế không chỉ có Đại Nội: 6 trải nghiệm nên thử", new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 1420 },
                    { 13, 4, 5, "Bạn có thể đi sớm, tham quan Tràng An buổi sáng, chiều lên Hang Múa săn hoàng hôn và kết thúc bằng ẩm thực dê núi đặc trưng.", new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "ninh-binh-1-ngay-lich-trinh", "Published", "Lịch trình tối ưu cho chuyến đi ngắn từ Hà Nội.", "/uploads/media/NinhBinh1.webp", "Ninh Bình 1 ngày: Tràng An - Hang Múa - Hoa Lư", new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 1670 },
                    { 14, 5, 5, "Ninh Thuận là điểm đến tuyệt vời cho team yêu nắng gió, ảnh đẹp và các hoạt động ngoài trời như trekking nhẹ, tắm biển, check-in đồi cát.", new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "ninh-thuan-cung-duong-bien-cuc-chill", "Published", "Vĩnh Hy, Hang Rái, đồi cát và vườn nho trong một hành trình.", "/uploads/media/NinhThuan.webp", "Ninh Thuận mùa nắng đẹp: cung đường biển cực chill", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 1560 },
                    { 15, 6, 9, "Ưu tiên resort gần biển, kết hợp tham quan đồi cát, làng chài và các điểm vui chơi dễ di chuyển.", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "phan-thiet-mui-ne-gia-dinh-3n2d", "Draft", "Gợi ý lịch nhẹ nhàng cho gia đình có trẻ nhỏ.", "/uploads/media/PhanThiet1.webp", "Phan Thiết - Mũi Né: lịch trình gia đình 3 ngày 2 đêm", new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 720 },
                    { 16, 7, 4, "Nên đi từ sớm để cảm nhận trọn không khí giao thương trên sông. Bún riêu, hủ tiếu và trái cây tại thuyền là trải nghiệm rất đáng nhớ.", new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "can-tho-di-cho-noi-kinh-nghiem", "Published", "Khung giờ đẹp, cách thuê thuyền và món ăn nên thử.", "/uploads/media/CanTho.webp", "Cần Thơ buổi sớm: đi chợ nổi thế nào cho trọn vẹn?", new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 1340 },
                    { 17, 8, 10, "Bạn có thể đi cáp treo lên núi, tham quan chùa và thưởng thức bánh tráng phơi sương, muối tôm — đặc sản nổi tiếng của Tây Ninh.", new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "tay-ninh-trong-ngay-nui-ba-den", "Published", "Trip ngắn cho cuối tuần từ TP.HCM.", "/uploads/media/TayNinh1.webp", "Tây Ninh trong ngày: Núi Bà Đen và đặc sản địa phương", new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 990 },
                    { 18, 9, 8, "Phú Quý phù hợp cho người thích biển hoang sơ. Chi phí vừa phải, trải nghiệm địa phương chân thực và nhiều góc ảnh đẹp tự nhiên.", new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "dao-phu-quy-cap-nhat-chi-phi", "Published", "Tổng hợp chi phí tàu, lưu trú, ăn uống và thuê xe.", "/uploads/media/DaoPhuQuy.webp", "Đảo Phú Quý có gì hay? Cập nhật chi phí mới nhất", new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 1440 },
                    { 19, 1, 3, "Nếu đi lần đầu, bạn nên ưu tiên động Thiên Đường buổi sáng và Phong Nha buổi chiều để giảm đông, thuận tiện chụp ảnh và di chuyển.", new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "quang-binh-2n1d-phong-nha-hay-thien-duong", "Published", "So sánh thời gian, trải nghiệm và lịch tối ưu.", "/uploads/media/QuangBinh2.webp", "Quảng Bình 2N1Đ: đi Phong Nha hay động Thiên Đường trước?", new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1280 },
                    { 20, 2, 2, "Các tuyến Đà Nẵng, Nha Trang, Phú Quốc và Quy Nhơn đang có mức giá tốt theo khung khởi hành cố định. Đặt sớm để giữ chỗ đẹp.", new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "khuyen-mai-thang-5-2026-san-tour-bien", "Published", "Nhiều tuyến biển giảm giá, áp dụng số lượng có hạn.", "/uploads/media/QuyNhon.webp", "Khuyến mãi tháng 5/2026: săn tour biển giá tốt", new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 2210 }
                });

            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Id", "Comment", "CreatedAt", "Rating", "TourId", "UserId" },
                values: new object[,]
                {
                    { 1, "Tour Côn Đảo rất chỉn chu, lịch trình vừa sức và HDV hỗ trợ nhiệt tình.", new DateTime(2026, 4, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 1, 2 },
                    { 2, "Phú Quốc đẹp, resort sạch, bữa sáng ổn. Điểm trừ nhỏ là chờ check-in hơi lâu.", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 2, 3 },
                    { 3, "Nha Trang biển đẹp, xe đưa đón đúng giờ, gia đình mình rất hài lòng.", new DateTime(2026, 4, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 3, 4 },
                    { 4, "Phú Yên yên bình, cảnh đẹp tự nhiên, phù hợp nghỉ ngắn ngày cuối tuần.", new DateTime(2026, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 4, 5 },
                    { 5, "Du thuyền Hạ Long đáng tiền, đồ ăn ngon, hướng dẫn viên chuyên nghiệp.", new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 5, 6 },
                    { 6, "Đà Nẵng ổn, nhưng thời gian tham quan Bà Nà hơi gấp.", new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, 6, 7 },
                    { 7, "Quy Nhơn biển trong, khách sạn gần trung tâm nên đi lại thuận tiện.", new DateTime(2026, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 7, 8 },
                    { 8, "Ninh Thuận nắng đẹp, lịch trình hợp lý, ảnh chụp lên rất đẹp.", new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 8, 9 },
                    { 9, "Phan Thiết ổn, nhưng dịch vụ ăn trưa cần cải thiện thêm.", new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, 9, 1 },
                    { 10, "Đà Lạt thời tiết đẹp, lịch nhẹ nhàng, phù hợp gia đình có người lớn tuổi.", new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 10, 2 },
                    { 11, "Mộc Châu mùa hoa rất đáng đi, homestay sạch sẽ và view đẹp.", new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 11, 3 },
                    { 12, "Sa Pa mây đẹp, xe di chuyển an toàn, HDV rất có tâm.", new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 12, 4 },
                    { 13, "Hà Giang cảnh hùng vĩ, nhưng đường đèo dài nên hơi mệt với người lớn tuổi.", new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 13, 5 },
                    { 14, "Buôn Ma Thuột thú vị, đặc biệt là bảo tàng cà phê và trải nghiệm địa phương.", new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 14, 6 },
                    { 15, "Cao Bằng đẹp ngoài mong đợi, lịch trình hợp lý và không bị quá dồn.", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 15, 7 },
                    { 16, "Huế trầm lắng, đồ ăn ngon, phù hợp cho chuyến đi thư giãn.", new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 16, 8 },
                    { 17, "Ninh Bình đi 1 ngày rất tiện, cảnh Tràng An đẹp và dễ đi.", new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 17, 9 },
                    { 18, "Cần Thơ chợ nổi thú vị, nên đi sớm để trải nghiệm trọn vẹn hơn.", new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 18, 1 },
                    { 19, "Tây Ninh ổn cho chuyến đi ngắn, cần thêm thời gian ở điểm tham quan chính.", new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, 19, 2 },
                    { 20, "Đảo Phú Quý biển rất đẹp, chi phí hợp lý, đáng đi lại lần nữa.", new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 20, 3 }
                });

            migrationBuilder.InsertData(
                table: "TourSchedules",
                columns: new[] { "Id", "AdultPrice", "AvailableSeats", "ChildPrice", "DepartureDate", "Quota", "ReturnDate", "Status", "TourId" },
                values: new object[,]
                {
                    { 1, 3550000m, 12, 2485000.0m, new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 1 },
                    { 2, 3570000m, 8, 2499000.0m, new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 1 },
                    { 3, 3600000m, 12, 2520000.0m, new DateTime(2026, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 2 },
                    { 4, 3640000m, 8, 2548000.0m, new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 2 },
                    { 5, 3650000m, 12, 2555000.0m, new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 3 },
                    { 6, 3710000m, 0, 2597000.0m, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 3 },
                    { 7, 3700000m, 12, 2590000.0m, new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 4 },
                    { 8, 3780000m, 8, 2646000.0m, new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 4 },
                    { 9, 3750000m, 12, 2625000.0m, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 5 },
                    { 10, 3850000m, 8, 2695000.0m, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 5 },
                    { 11, 3800000m, 12, 2660000.0m, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 6 },
                    { 12, 3920000m, 0, 2744000.0m, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 6 },
                    { 13, 3850000m, 12, 2695000.0m, new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 7 },
                    { 14, 3990000m, 8, 2793000.0m, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 7 },
                    { 15, 3900000m, 12, 2730000.0m, new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 8 },
                    { 16, 4060000m, 8, 2842000.0m, new DateTime(2026, 5, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 8 },
                    { 17, 3950000m, 12, 2765000.0m, new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 9 },
                    { 18, 4130000m, 0, 2891000.0m, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 9 },
                    { 19, 3800000m, 12, 2660000.0m, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 10 },
                    { 20, 4000000m, 8, 2800000.0m, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 10 },
                    { 21, 3850000m, 12, 2695000.0m, new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 11 },
                    { 22, 4070000m, 8, 2849000.0m, new DateTime(2026, 5, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 11 },
                    { 23, 3900000m, 12, 2730000.0m, new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 12 },
                    { 24, 4140000m, 0, 2898000.0m, new DateTime(2026, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 12 },
                    { 25, 3950000m, 12, 2765000.0m, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 13 },
                    { 26, 4210000m, 8, 2947000.0m, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 13 },
                    { 27, 4000000m, 12, 2800000.0m, new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 14 },
                    { 28, 4280000m, 8, 2996000.0m, new DateTime(2026, 5, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 14 },
                    { 29, 4050000m, 12, 2835000.0m, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 15 },
                    { 30, 4350000m, 0, 3045000.0m, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 15 },
                    { 31, 3600000m, 12, 2520000.0m, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 16 },
                    { 32, 3920000m, 8, 2744000.0m, new DateTime(2026, 5, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 16 },
                    { 33, 3650000m, 12, 2555000.0m, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 17 },
                    { 34, 3990000m, 8, 2793000.0m, new DateTime(2026, 5, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 17 },
                    { 35, 3200000m, 12, 2240000.0m, new DateTime(2026, 5, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 18 },
                    { 36, 3560000m, 0, 2492000.0m, new DateTime(2026, 5, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 18 },
                    { 37, 3250000m, 12, 2275000.0m, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 19 },
                    { 38, 3630000m, 8, 2541000.0m, new DateTime(2026, 5, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 19 },
                    { 39, 4600000m, 12, 3220000.0m, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 20 },
                    { 40, 5000000m, 8, 3500000.0m, new DateTime(2026, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 20 },
                    { 41, 4650000m, 12, 3255000.0m, new DateTime(2026, 5, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 21 },
                    { 42, 5070000m, 0, 3549000.0m, new DateTime(2026, 5, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 25, new DateTime(2026, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 21 }
                });

            migrationBuilder.InsertData(
                table: "Bookings",
                columns: new[] { "Id", "AdultCount", "ChildCount", "ContactEmail", "ContactName", "ContactPhone", "CreatedAt", "SpecialRequest", "Status", "TotalPassengers", "TotalPrice", "TourScheduleId", "UserId", "VoucherId" },
                values: new object[,]
                {
                    { 1, 0, 0, "", "", "", new DateTime(2026, 4, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 1750000m, 1, 2, null },
                    { 2, 0, 0, "", "", "", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 3, 2000000m, 2, 3, null },
                    { 3, 0, 0, "", "", "", new DateTime(2026, 4, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 1, 2250000m, 3, 4, null },
                    { 4, 0, 0, "", "", "", new DateTime(2026, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 2, 2500000m, 4, 5, null },
                    { 5, 0, 0, "", "", "", new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 3, 2750000m, 5, 6, null },
                    { 6, 0, 0, "", "", "", new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 1, 3000000m, 6, 7, null },
                    { 7, 0, 0, "", "", "", new DateTime(2026, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 3250000m, 7, 8, null },
                    { 8, 0, 0, "", "", "", new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 3, 3500000m, 8, 9, null },
                    { 9, 0, 0, "", "", "", new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 1, 3750000m, 9, 1, null },
                    { 10, 0, 0, "", "", "", new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 4000000m, 10, 2, null },
                    { 11, 0, 0, "", "", "", new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 3, 4250000m, 11, 3, null },
                    { 12, 0, 0, "", "", "", new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 1, 4500000m, 12, 4, null },
                    { 13, 0, 0, "", "", "", new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 4750000m, 13, 5, null },
                    { 14, 0, 0, "", "", "", new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 3, 5000000m, 14, 6, null },
                    { 15, 0, 0, "", "", "", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 1, 5250000m, 15, 7, null },
                    { 16, 0, 0, "", "", "", new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 2, 5500000m, 16, 8, null },
                    { 17, 0, 0, "", "", "", new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 3, 5750000m, 17, 9, null },
                    { 18, 0, 0, "", "", "", new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 1, 6000000m, 18, 1, null },
                    { 19, 0, 0, "", "", "", new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 6250000m, 19, 2, null },
                    { 20, 0, 0, "", "", "", new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 3, 6500000m, 20, 3, null }
                });

            migrationBuilder.InsertData(
                table: "NewsTagMaps",
                columns: new[] { "NewsPostId", "NewsTagId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 4 },
                    { 3, 3 },
                    { 4, 5 },
                    { 5, 6 },
                    { 6, 4 },
                    { 7, 2 },
                    { 8, 7 },
                    { 9, 2 },
                    { 10, 6 },
                    { 11, 4 },
                    { 12, 6 },
                    { 13, 5 },
                    { 14, 5 },
                    { 15, 9 },
                    { 16, 3 },
                    { 17, 4 },
                    { 18, 1 },
                    { 19, 7 },
                    { 20, 10 }
                });

            migrationBuilder.InsertData(
                table: "TourImages",
                columns: new[] { "Id", "IsPrimary", "MediaAssetId", "SortOrder", "TourId" },
                values: new object[,]
                {
                    { 1, true, 10, 1, 1 },
                    { 2, false, 11, 2, 1 },
                    { 3, false, 12, 3, 1 },
                    { 4, true, 43, 1, 2 },
                    { 5, false, 44, 2, 2 },
                    { 6, false, 45, 3, 2 },
                    { 7, true, 31, 1, 3 },
                    { 8, false, 32, 2, 3 },
                    { 9, false, 33, 3, 3 },
                    { 10, true, 46, 1, 4 },
                    { 11, false, 47, 2, 4 },
                    { 12, false, 48, 3, 4 },
                    { 13, true, 61, 1, 5 },
                    { 14, false, 62, 2, 5 },
                    { 15, false, 63, 3, 5 },
                    { 16, true, 16, 1, 6 },
                    { 17, false, 17, 2, 6 },
                    { 18, false, 18, 3, 6 },
                    { 19, true, 52, 1, 7 },
                    { 20, false, 53, 2, 7 },
                    { 21, false, 54, 3, 7 },
                    { 22, true, 37, 1, 8 },
                    { 23, false, 38, 2, 8 },
                    { 24, false, 39, 3, 8 },
                    { 25, true, 40, 1, 9 },
                    { 26, false, 41, 2, 9 },
                    { 27, false, 42, 3, 9 },
                    { 28, true, 13, 1, 10 },
                    { 29, false, 14, 2, 10 },
                    { 30, false, 15, 3, 10 },
                    { 31, true, 28, 1, 11 },
                    { 32, false, 29, 2, 11 },
                    { 33, false, 30, 3, 11 },
                    { 34, true, 55, 1, 12 },
                    { 35, false, 56, 2, 12 },
                    { 36, false, 57, 3, 12 },
                    { 37, true, 22, 1, 13 },
                    { 38, false, 23, 2, 13 },
                    { 39, false, 24, 3, 13 },
                    { 40, true, 1, 1, 14 },
                    { 41, false, 2, 2, 14 },
                    { 42, false, 3, 3, 14 },
                    { 43, true, 7, 1, 15 },
                    { 44, false, 8, 2, 15 },
                    { 45, false, 9, 3, 15 },
                    { 46, true, 25, 1, 16 },
                    { 47, false, 26, 2, 16 },
                    { 48, false, 27, 3, 16 },
                    { 49, true, 34, 1, 17 },
                    { 50, false, 35, 2, 17 },
                    { 51, false, 36, 3, 17 },
                    { 52, true, 4, 1, 18 },
                    { 53, false, 5, 2, 18 },
                    { 54, false, 6, 3, 18 },
                    { 55, true, 58, 1, 19 },
                    { 56, false, 59, 2, 19 },
                    { 57, false, 60, 3, 19 },
                    { 58, true, 19, 1, 20 },
                    { 59, false, 20, 2, 20 },
                    { 60, false, 21, 3, 20 },
                    { 61, true, 49, 1, 21 },
                    { 62, false, 50, 2, 21 },
                    { 63, false, 51, 3, 21 }
                });

            migrationBuilder.InsertData(
                table: "BookingAttendees",
                columns: new[] { "Id", "BookingId", "DateOfBirth", "FullName", "Type" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(1989, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nguyễn Minh Anh", "Adult" },
                    { 2, 2, new DateTime(1990, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Trần Thu Hằng", "Adult" },
                    { 3, 3, new DateTime(1991, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lê Quốc Cường", "Adult" },
                    { 4, 4, new DateTime(1992, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Phạm Ngọc Diễm", "Adult" },
                    { 5, 5, new DateTime(1993, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hoàng Gia Bảo", "Adult" },
                    { 6, 6, new DateTime(1994, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đỗ Khánh Linh", "Adult" },
                    { 7, 7, new DateTime(1995, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Võ Thành Nam", "Adult" },
                    { 8, 8, new DateTime(2016, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bùi Thanh Mai", "Child" },
                    { 9, 9, new DateTime(1997, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ngô Đức Long", "Adult" },
                    { 10, 10, new DateTime(1998, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Phan Quang Huy", "Adult" },
                    { 11, 11, new DateTime(1999, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nguyễn Gia Hân", "Adult" },
                    { 12, 12, new DateTime(1988, 1, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "Trần Quốc Việt", "Adult" },
                    { 13, 13, new DateTime(1989, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lý Hoàng Nam", "Adult" },
                    { 14, 14, new DateTime(1990, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đặng Bảo Trân", "Adult" },
                    { 15, 15, new DateTime(1991, 4, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Phạm Nhật Long", "Adult" },
                    { 16, 16, new DateTime(1992, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Vũ Khánh Vy", "Adult" },
                    { 17, 17, new DateTime(1993, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lê Minh Tâm", "Adult" },
                    { 18, 18, new DateTime(1994, 7, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đỗ Quốc Đạt", "Adult" },
                    { 19, 19, new DateTime(1995, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nguyễn Hoài Phương", "Adult" },
                    { 20, 20, new DateTime(1996, 9, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hoàng Tuấn Kiệt", "Adult" }
                });

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "BookingId", "CreatedAt", "PaymentMethod", "Status", "TransactionCode" },
                values: new object[,]
                {
                    { 1, 1750000m, 1, new DateTime(2026, 4, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS001" },
                    { 2, 2000000m, 2, new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Success", "TRANS002" },
                    { 3, 2250000m, 3, new DateTime(2026, 4, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Pending", "TRANS003" },
                    { 4, 2500000m, 4, new DateTime(2026, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS004" },
                    { 5, 2750000m, 5, new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS005" },
                    { 6, 3000000m, 6, new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Pending", "TRANS006" },
                    { 7, 3250000m, 7, new DateTime(2026, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS007" },
                    { 8, 3500000m, 8, new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS008" },
                    { 9, 3750000m, 9, new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Pending", "TRANS009" },
                    { 10, 4000000m, 10, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Success", "TRANS010" },
                    { 11, 4250000m, 11, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS011" },
                    { 12, 4500000m, 12, new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS012" },
                    { 13, 4750000m, 13, new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS013" },
                    { 14, 5000000m, 14, new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Success", "TRANS014" },
                    { 15, 5250000m, 15, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Pending", "TRANS015" },
                    { 16, 5500000m, 16, new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS016" },
                    { 17, 5750000m, 17, new DateTime(2026, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS017" },
                    { 18, 6000000m, 18, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Pending", "TRANS018" },
                    { 19, 6250000m, 19, new DateTime(2026, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS019" },
                    { 20, 6500000m, 20, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS020" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookingAttendees_BookingId",
                table: "BookingAttendees",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_TourScheduleId",
                table: "Bookings",
                column: "TourScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_VoucherId",
                table: "Bookings",
                column: "VoucherId");

            migrationBuilder.CreateIndex(
                name: "IX_MediaAssets_UploadedById",
                table: "MediaAssets",
                column: "UploadedById");

            migrationBuilder.CreateIndex(
                name: "IX_NewsCategories_Slug",
                table: "NewsCategories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NewsPosts_AuthorId",
                table: "NewsPosts",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsPosts_CategoryId",
                table: "NewsPosts",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsPosts_PublishedById",
                table: "NewsPosts",
                column: "PublishedById");

            migrationBuilder.CreateIndex(
                name: "IX_NewsPosts_Slug",
                table: "NewsPosts",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NewsTagMaps_NewsTagId",
                table: "NewsTagMaps",
                column: "NewsTagId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsTags_Slug",
                table: "NewsTags",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_TourId",
                table: "Reviews",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TourImages_MediaAssetId",
                table: "TourImages",
                column: "MediaAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_TourImages_TourId",
                table: "TourImages",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_CategoryId",
                table: "Tours",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TourSchedules_TourId",
                table: "TourSchedules",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_BookingId",
                table: "Transactions",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingAttendees");

            migrationBuilder.DropTable(
                name: "NewsTagMaps");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "TourImages");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "NewsPosts");

            migrationBuilder.DropTable(
                name: "NewsTags");

            migrationBuilder.DropTable(
                name: "MediaAssets");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "NewsCategories");

            migrationBuilder.DropTable(
                name: "TourSchedules");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Vouchers");

            migrationBuilder.DropTable(
                name: "Tours");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
