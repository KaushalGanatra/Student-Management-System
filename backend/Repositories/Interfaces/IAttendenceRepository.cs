using System.Collections.Generic;
using backend.DTOs;

namespace backend.Repositories.Interfaces
{
    public interface IAttendenceRepository
    {
        Task<IEnumerable<AttendenceDTO>> ListAttendenceByDate(DateOnly attendenceDate);

        Task<IEnumerable<AttendenceDTO>> AddAttendenceData(IEnumerable<AttendenceDTO> attendenceObject);
    }
}
