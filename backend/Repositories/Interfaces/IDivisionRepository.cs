using System.Collections.Generic;
using backend.DTOs;

namespace backend.Repositories.Interfaces
{
    public interface IDivisionRepository
    {
        Task<IEnumerable<DivisionDTO>> ListAllDivisions();

        Task<DivisionDTO> AddDivision(DivisionDTO divisionObject);

        string? GetDivisionNameById(Guid id);

    }
}
