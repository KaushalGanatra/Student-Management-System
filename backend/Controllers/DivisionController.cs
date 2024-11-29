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
    [Route("api/division")]
    [ApiController]
    public class DivisionController : ControllerBase
    {
        private readonly IDivisionRepository _divisionRepository;
        public DivisionController(IDivisionRepository divisionRepository)
        {
            _divisionRepository = divisionRepository;
        }

        [HttpGet]
        public async Task<IActionResult> ListDivisions()
        {
            var divisions = await _divisionRepository.ListAllDivisions();
            if (divisions == null)
            {
                return NotFound("No classes found");
            }
            return Ok(divisions);
        }

        [HttpPost]
        public async Task<IActionResult> AddClass(DivisionDTO divisionDto)
        {
            if (divisionDto == null)
            {
                return BadRequest("Provide ClassNumber");
            }

            var divisionObj = await _divisionRepository.AddClass(divisionDto);

            if (divisionObj == null)
            {
                return BadRequest("Error while adding class");
            }
            return Created(string.Empty, divisionObj);
        }
    }
}
