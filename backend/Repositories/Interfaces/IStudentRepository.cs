using System.Collections.Generic;
using backend.DTOs;

namespace backend.Repositories.Interfaces
{
    public interface IStudentRepository
    {
        Task<IEnumerable<StudentDTO>> GetAllStudents();

        //StudentDTO GetStudentById(string id);

        //void AddStudent(StudentDTO studentDto);

        //void UpdateStudent(StudentDTO studentdto);

        //void DeleteStudent(string id);
    }
}
