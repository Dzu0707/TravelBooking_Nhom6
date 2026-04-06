using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTour.API.Migrations
{
    /// <inheritdoc />
    public partial class FinalSyncArchitecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "MinPrice",
                table: "Tours",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinPrice",
                table: "Tours");
        }
    }
}
