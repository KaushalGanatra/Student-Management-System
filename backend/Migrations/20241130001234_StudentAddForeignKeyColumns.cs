using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class StudentAddForeignKeyColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ClassId",
                table: "Students",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "DivisionId",
                table: "Students",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.Sql(@"
            UPDATE ""Students""
            SET 
                ""ClassId"" = c.""Id""
            FROM ""Class"" c
            WHERE ""Students"".""Class"" = c.""ClassNumber"";
        ");

            migrationBuilder.Sql(@"
                UPDATE ""Students""
                SET 
                    ""DivisionId"" = d.""Id""
                FROM ""Division"" d
                WHERE ""Students"".""Division"" = d.""DivisionName"";
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "DivisionId",
                table: "Students");
        }
    }
}
