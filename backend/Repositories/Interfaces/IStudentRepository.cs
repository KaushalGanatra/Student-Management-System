using System.Collections.Generic;
using backend.DTOs;

namespace backend.Repositories.Interfaces
{
    public interface IStudentRepository
    {
        Task<IEnumerable<StudentDTO>> ListAllStudents(string? sClass, string? sDivision);

        Task<StudentDTO?> GetStudentById(Guid id);

        Task<StudentDTO?> AddStudent(StudentDTO studentDto);

        Task<StudentDTO?> UpdateStudent(Guid id, StudentDTO studentdto);

        Task<bool> DeleteStudent(Guid id);
    }
}
