using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using FluentValidation.Results;
using System.ComponentModel.DataAnnotations;
using backend.Repositories.Interfaces;
using backend.Repositories.Implementations;

namespace backend.Controllers
{
    [Route("api/attendance")]
    [ApiController]
    public class AttendenceController : ControllerBase
    {
        private readonly IAttendenceRepository _attendenceRepository;
        public AttendenceController(IAttendenceRepository attendenceRepository)
        {
            _attendenceRepository = attendenceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> ListByDate(DateOnly attendenceDate)
        {
            if (attendenceDate == DateOnly.MinValue)
            {
                return BadRequest("Provide a valid date");
            }

            var attendenceData = await _attendenceRepository.ListAttendenceByDate(attendenceDate);
            if (attendenceData == null || !attendenceData.Any())
            {
                return NotFound("No attendence data found for the provided date");
            }
            return Ok(attendenceData);
        }

        [HttpPost]
        public async Task<IActionResult> AddAttendenceData(IEnumerable<AttendenceDTO> attendenceDtos)
        {
            if (attendenceDtos == null)
            {
                return BadRequest("Provide Proper attendence data");
            }

            var attendenceObjs = await _attendenceRepository.AddAttendenceData(attendenceDtos);

            if (attendenceObjs == null)
            {
                return BadRequest("Error while adding attendence data");
            }
            return Created(string.Empty, attendenceObjs);
        }
    }
}
