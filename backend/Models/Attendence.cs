using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Attendence
    {
        [Key]
        public required Guid Id { get; set; }
        public required DateOnly AttendenceDate { get; set; }
        [ForeignKey("Student")]
        public required Guid StudentId { get; set; }
        public bool IsPresent { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}