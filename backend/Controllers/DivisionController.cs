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
        public async Task<IActionResult> AddDivision(DivisionDTO divisionDto)
        {
            if (divisionDto == null)
            {
                return BadRequest("Provide ClassNumber");
            }

            var divisionObj = await _divisionRepository.AddDivision(divisionDto);

            if (divisionObj == null)
            {
                return BadRequest("Error while adding class");
            }
            return Created(string.Empty, divisionObj);
        }

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetDivisionNameById(string id)
        //{
        //    if (!Guid.TryParse(id, out var parsedId))
        //    {
        //        return BadRequest("The provided ID is not valid.");
        //    }

        //    var divisionName = await _divisionRepository.GetDivisionNameById(parsedId);

        //    if (string.IsNullOrEmpty(divisionName))
        //    {
        //        return NotFound("Provided division id not found");
        //    }

        //    return Ok(divisionName);
        //}
    }
}
