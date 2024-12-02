using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Division
    {
        [Key]
        public required Guid Id { get; set; }
        public required string DivisionName { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}