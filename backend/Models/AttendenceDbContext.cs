using Microsoft.EntityFrameworkCore;
namespace backend.Context
{
    public class AttendenceDbContext : DbContext
    {
        public AttendenceDbContext(DbContextOptions<AttendenceDbContext> options) : base(options)
        {
        }
        public DbSet<Attendence> AttendenceDB {get; set;}
    }
}