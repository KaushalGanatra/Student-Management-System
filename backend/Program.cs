namespace backend
{
    using backend.Context;
    using Microsoft.EntityFrameworkCore;

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddDbContext<StudentDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("myconn")));

            builder.Services.AddDbContext<AttendenceDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("myconn")));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", builder =>
                {
                    builder.WithOrigins("http://localhost:5173")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

            var app = builder.Build();

            if (!app.Environment.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowFrontend");
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
