using backend.Models;

namespace backend.DTOs
{
    public class StudentDTO
    {
        public string? id {  get; set; }
        public string? Name { get; set; }
        public string? Class { get; set; }
        public string? Division { get; set; }
        public String? Gender { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}