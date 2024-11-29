using System.Collections.Generic;
using backend.DTOs;

namespace backend.Repositories.Interfaces
{
    public interface IClassRepository
    {
        Task<IEnumerable<ClassDTO>> ListAllClasses();

        Task<ClassDTO> AddClass(ClassDTO classObject);
    }
}
