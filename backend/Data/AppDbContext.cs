using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Class> Class { get; set; }
        public DbSet<Division> Division { get; set; }
        //public DbSet<Attendance> Attendances { get; set; }
    }
}
