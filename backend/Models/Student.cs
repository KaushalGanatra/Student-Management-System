using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public enum Gender
    {
        Male,
        Female,
        Other
    }

    public class Student
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Class { get; set; }

        public string Division { get; set; }

        public Gender Gender { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

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
