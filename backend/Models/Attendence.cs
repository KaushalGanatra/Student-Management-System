using System.ComponentModel.DataAnnotations.Schema; //for foreign key

namespace backend.Context
{
    public class Attendence
    {
        public int Id {get; set;}
        [ForeignKey("Student")]
        public int Student_Id { get; set; }
        public string? Status { get; set; }
        public DateTime Date { get; set; }
    }
}