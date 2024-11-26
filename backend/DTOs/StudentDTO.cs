using backend.Models;

namespace backend.DTOs
{
    public class StudentDTO
    {
        public string? Name { get; set; }
        public int? Class { get; set; }
        public string? Division { get; set; }
        public String? Gender { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}