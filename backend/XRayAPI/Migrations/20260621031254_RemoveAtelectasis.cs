using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XRayAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAtelectasis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Atelectasis",
                table: "ScanResults");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Atelectasis",
                table: "ScanResults",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
