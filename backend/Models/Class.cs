using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Class
    {
        [Key]
        public required Guid Id { get; set; }
        public required int ClassNumber { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
 }