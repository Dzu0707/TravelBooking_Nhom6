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
                    IsLocked = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    { 1, "Đắm mình trong làn nước trong xanh...", "Tour Biển" },
                    { 2, "Hành trình ngược dòng thời gian...", "Tour Di Sản - Văn Hóa" },
                    { 3, "Dành cho những tâm hồn đam mê xê dịch...", "Tour Khám Phá" },
                    { 4, "Trải nghiệm nhịp sống bình dị...", "Tour Miền Tây" },
                    { 5, "Chinh phục những đỉnh cao mây mờ...", "Tour Núi" }
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
                    { 1, "SUMMER10", "Percentage", 10m, new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 50 },
                    { 2, "SALE200K", "FixedAmount", 200000m, new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 30 },
                    { 3, "NEWUSER", "Percentage", 15m, new DateTime(2026, 10, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 100 },
                    { 4, "VIP500K", "FixedAmount", 500000m, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 10 },
                    { 5, "HOLIDAY", "Percentage", 20m, new DateTime(2026, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 20 },
                    { 6, "FLASH", "FixedAmount", 100000m, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 40 },
                    { 7, "WEEKEND", "Percentage", 5m, new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 60 },
                    { 8, "TRAVEL50", "FixedAmount", 50000m, new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 80 },
                    { 9, "FAMILY", "Percentage", 12m, new DateTime(2026, 9, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 25 },
                    { 10, "LASTMIN", "Percentage", 8m, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 15 }
                });

            migrationBuilder.InsertData(
                table: "Tours",
                columns: new[] { "Id", "CategoryId", "Code", "CreatedAt", "DepartureLocation", "Description", "MinPrice", "Name" },
                values: new object[,]
                {
                    { 1, 1, "CD001", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Thiên đường biển hoang sơ", 4500000m, "Tour Côn Đảo" },
                    { 2, 3, "PQ002", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Trải nghiệm biển đảo yên bình", 3000000m, "Tour Đảo Phú Quý" },
                    { 3, 3, "NT003", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hà Nội", "Biển xanh & vui chơi giải trí", 5200000m, "Tour Nha Trang" },
                    { 4, 2, "PQ004", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "TP.HCM", "Đảo ngọc nghỉ dưỡng cao cấp", 3800000m, "Tour Phú Quốc" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsLocked", "PasswordHash", "Phone", "RoleId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "a@gmail.com", "Nguyễn Văn A", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000001", 2 },
                    { 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "b@gmail.com", "Trần Thị B", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000002", 2 },
                    { 3, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "c@gmail.com", "Lê Văn C", true, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000003", 2 },
                    { 4, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "d@gmail.com", "Phạm Thị D", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000004", 2 },
                    { 5, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "e@gmail.com", "Hoàng Văn E", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000005", 2 },
                    { 6, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "f@gmail.com", "Đỗ Thị F", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000006", 2 },
                    { 7, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "g@gmail.com", "Võ Văn G", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000007", 2 },
                    { 8, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "h@gmail.com", "Bùi Thị H", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000008", 2 },
                    { 9, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "i@gmail.com", "Ngô Văn I", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "090000009", 2 },
                    { 10, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@travel.com", "Admin", false, "$2a$11$5JCEuIAPe01M9Hz0jahT9.ZfJKi2Vl9iRe6ICMhY10bgnRQ4yA.FW", "0999999999", 1 }
                });

            migrationBuilder.InsertData(
                table: "MediaAssets",
                columns: new[] { "Id", "AltText", "CreatedAt", "FileName", "FileUrl", "UploadedById" },
                values: new object[,]
                {
                    { 1, "Côn Đảo", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "ConDao.webp", "/uploads/media/ConDao.webp", 10 },
                    { 2, "Côn Đảo 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "ConDao1.webp", "/uploads/media/ConDao1.webp", 10 },
                    { 3, "Côn Đảo 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "ConDao2.webp", "/uploads/media/ConDao2.webp", 10 },
                    { 4, "Đảo Phú Quý", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaoPhuQuy.webp", "/uploads/media/DaoPhuQuy.webp", 10 },
                    { 5, "Đảo Phú Quý 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaoPhuQuy1.webp", "/uploads/media/DaoPhuQuy1.webp", 10 },
                    { 6, "Đảo Phú Quý 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "DaoPhuQuy2.webp", "/uploads/media/DaoPhuQuy2.webp", 10 },
                    { 7, "Nha Trang", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NhaTrang.webp", "/uploads/media/NhaTrang.webp", 10 },
                    { 8, "Nha Trang 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NhaTrang1.webp", "/uploads/media/NhaTrang1.webp", 10 },
                    { 9, "Nha Trang 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "NhaTrang2.webp", "/uploads/media/NhaTrang2.webp", 10 },
                    { 10, "Phú Quốc", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuQuoc.webp", "/uploads/media/PhuQuoc.webp", 10 },
                    { 11, "Phú Quốc 1", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuQuoc1.webp", "/uploads/media/PhuQuoc1.webp", 10 },
                    { 12, "Phú Quốc 2", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "PhuQuoc2.webp", "/uploads/media/PhuQuoc2.webp", 10 }
                });

            migrationBuilder.InsertData(
                table: "NewsPosts",
                columns: new[] { "Id", "AuthorId", "CategoryId", "Content", "CreatedAt", "IsFeatured", "PublishedAt", "PublishedById", "Slug", "Status", "Summary", "ThumbnailUrl", "Title", "UpdatedAt", "ViewCount" },
                values: new object[,]
                {
                    { 1, 1, 1, "Phú Quốc nổi tiếng với bãi Sao...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "bien-dep-phu-quoc", "Published", "Danh sách bãi biển đẹp", "/uploads/media/PhuQuoc.webp", "Top 5 bãi biển đẹp nhất Phú Quốc", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 120 },
                    { 2, 2, 3, "Đà Lạt là điểm đến lý tưởng...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "kinh-nghiem-da-lat", "Published", "Hướng dẫn du lịch Đà Lạt", "/uploads/media/PhuQuoc.webp", "Kinh nghiệm đi Đà Lạt tự túc", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 90 },
                    { 3, 3, 4, "Hải sản Nha Trang rất nổi tiếng...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "am-thuc-nha-trang", "Published", "Top món ngon Nha Trang", "/uploads/media/PhuQuoc.webp", "Ăn gì ở Nha Trang?", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 150 },
                    { 4, 4, 5, "Nếu may mắn bạn sẽ thấy tuyết...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "checkin-sapa", "Draft", "Sapa mùa đông cực đẹp", "/uploads/media/PhuQuoc.webp", "Check-in Sapa mùa tuyết", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 30 },
                    { 5, 5, 2, "Du lịch Đà Nẵng chưa bao giờ rẻ...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "tour-da-nang-gia-re", "Published", "Combo tiết kiệm", "/uploads/media/PhuQuoc.webp", "Tour Đà Nẵng giá rẻ", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 200 },
                    { 6, 6, 7, "Hà Giang là cung đường mơ ước...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "phuot-ha-giang", "Published", "Checklist phượt", "/uploads/media/PhuQuoc.webp", "Phượt Hà Giang cần chuẩn bị gì?", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 80 },
                    { 7, 7, 6, "Phú Yên đang nổi lên...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "review-resort-phu-yen", "Published", "Resort view biển", "/uploads/media/PhuQuoc.webp", "Review resort Phú Yên", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 60 },
                    { 8, 8, 9, "Các địa điểm phù hợp gia đình...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "du-lich-gia-dinh", "Published", "Gợi ý địa điểm", "/uploads/media/ConDao1.webp", "Du lịch gia đình nên đi đâu?", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 140 },
                    { 9, 9, 2, "Côn Đảo là điểm đến tâm linh...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "combo-con-dao", "Draft", "Ưu đãi hot", "/uploads/media/ConDao1.webp", "Combo Côn Đảo tiết kiệm", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 20 },
                    { 10, 1, 10, "Bạn có thể đi Nhà thờ Đức Bà...", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), true, null, null, "sai-gon-1-ngay", "Published", "City tour HCM", "/uploads/media/ConDao2.webp", "Khám phá Sài Gòn 1 ngày", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 300 }
                });

            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Id", "Comment", "CreatedAt", "Rating", "TourId", "UserId" },
                values: new object[,]
                {
                    { 1, "Tour rất tuyệt!", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 1, 1 },
                    { 2, "Khá ổn", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 2, 2 },
                    { 3, "Bình thường", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, 3, 3 },
                    { 4, "Rất đáng tiền", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 4, 4 },
                    { 5, "Không như mong đợi", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, 5 },
                    { 6, "Dịch vụ tốt", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 2, 6 },
                    { 7, "Cảnh đẹp", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 3, 7 },
                    { 8, "Tạm được", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, 4, 8 },
                    { 9, "Hài lòng", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, 1, 9 },
                    { 10, "Rất thích", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, 2, 1 }
                });

            migrationBuilder.InsertData(
                table: "TourSchedules",
                columns: new[] { "Id", "AdultPrice", "AvailableSeats", "ChildPrice", "DepartureDate", "Quota", "ReturnDate", "Status", "TourId" },
                values: new object[,]
                {
                    { 1, 4500000m, 10, 3000000m, new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 1 },
                    { 2, 3000000m, 0, 2000000m, new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 2 },
                    { 3, 5200000m, 5, 3500000m, new DateTime(2026, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 3 },
                    { 4, 3800000m, 0, 2500000m, new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cancelled", 4 },
                    { 5, 900000m, 8, 600000m, new DateTime(2026, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 1 },
                    { 6, 4700000m, 0, 3000000m, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Full", 2 },
                    { 7, 3200000m, 12, 2000000m, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 3 },
                    { 8, 3100000m, 0, 2000000m, new DateTime(2026, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cancelled", 4 },
                    { 9, 5500000m, 7, 3500000m, new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 1 },
                    { 10, 700000m, 3, 500000m, new DateTime(2026, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 20, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Available", 2 }
                });

            migrationBuilder.InsertData(
                table: "Bookings",
                columns: new[] { "Id", "AdultCount", "ChildCount", "ContactEmail", "ContactName", "ContactPhone", "CreatedAt", "SpecialRequest", "Status", "TotalPassengers", "TotalPrice", "TourScheduleId", "UserId", "VoucherId" },
                values: new object[,]
                {
                    { 1, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 9000000m, 1, 1, null },
                    { 2, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 2, 6000000m, 2, 2, null },
                    { 3, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 2, 10400000m, 3, 3, null },
                    { 4, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 2, 7600000m, 4, 4, null },
                    { 5, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 3, 2700000m, 5, 5, null },
                    { 6, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 2, 9400000m, 6, 6, null },
                    { 7, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 6400000m, 7, 7, null },
                    { 8, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Cancelled", 1, 3100000m, 8, 8, null },
                    { 9, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Confirmed", 2, 11000000m, 9, 9, null },
                    { 10, 0, 0, "", "", "", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Pending", 2, 1400000m, 10, 1, null }
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
                    { 5, 10 },
                    { 6, 7 },
                    { 7, 8 },
                    { 8, 9 },
                    { 9, 10 },
                    { 10, 5 }
                });

            migrationBuilder.InsertData(
                table: "TourImages",
                columns: new[] { "Id", "IsPrimary", "MediaAssetId", "SortOrder", "TourId" },
                values: new object[,]
                {
                    { 1, true, 1, 1, 1 },
                    { 2, false, 2, 2, 1 },
                    { 3, false, 3, 3, 1 },
                    { 4, true, 4, 1, 2 },
                    { 5, false, 5, 2, 2 },
                    { 6, false, 6, 3, 2 },
                    { 7, true, 7, 1, 3 },
                    { 8, false, 8, 2, 3 },
                    { 9, false, 9, 3, 3 },
                    { 10, true, 10, 1, 4 },
                    { 11, false, 11, 2, 4 },
                    { 12, false, 12, 3, 4 }
                });

            migrationBuilder.InsertData(
                table: "BookingAttendees",
                columns: new[] { "Id", "BookingId", "DateOfBirth", "FullName", "Type" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2000, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nguyễn Văn A", "Adult" },
                    { 2, 2, new DateTime(2001, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Trần Thị B", "Adult" },
                    { 3, 3, new DateTime(2002, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lê Văn C", "Adult" },
                    { 4, 4, new DateTime(2003, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Phạm Thị D", "Adult" },
                    { 5, 5, new DateTime(2004, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hoàng Văn E", "Adult" },
                    { 6, 6, new DateTime(2005, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đỗ Thị F", "Adult" },
                    { 7, 7, new DateTime(2000, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Võ Văn G", "Adult" },
                    { 8, 8, new DateTime(2001, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bùi Thị H", "Child" },
                    { 9, 9, new DateTime(2002, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ngô Văn I", "Adult" },
                    { 10, 10, new DateTime(1995, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Admin", "Adult" }
                });

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "BookingId", "CreatedAt", "PaymentMethod", "Status", "TransactionCode" },
                values: new object[,]
                {
                    { 1, 9000000m, 1, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Success", "TRANS001" },
                    { 2, 6000000m, 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Pending", "TRANS002" },
                    { 3, 10400000m, 3, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS003" },
                    { 4, 7600000m, 4, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS004" },
                    { 5, 2700000m, 5, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS005" },
                    { 6, 9400000m, 6, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Pending", "TRANS006" },
                    { 7, 6400000m, 7, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Success", "TRANS007" },
                    { 8, 3100000m, 8, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Failed", "TRANS008" },
                    { 9, 11000000m, 9, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "VNPay", "Success", "TRANS009" },
                    { 10, 1400000m, 10, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Momo", "Pending", "TRANS010" }
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
