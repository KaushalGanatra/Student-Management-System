using backend.Models;

namespace backend.DTOs
{
    public class AttendenceDTO
    {
        public string? Id { get; set; }
        public DateOnly AttendenceDate { get; set; }
        public string StudentId { get; set; }
        public bool IsPresent { get; set; }
    }
}