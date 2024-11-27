using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public enum Gender
    {
        Male,
        Female,
        Other,
        Undefined
    }

    public class Student
    {
        [Key]
        public required Guid Id { get; set; }

        public required string Name { get; set; }

        public required int Class { get; set; }

        public required string Division { get; set; }

        public required Gender Gender { get; set; }

        public required DateTime CreatedAt { get; set; }

        public required DateTime UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }

        public Student()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;  
            UpdatedAt = DateTime.UtcNow; 
        }

        public void UpdateTimestamp()
        {
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
