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
    [Route("api/class")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly IClassRepository _classRepository;
        public ClassController(IClassRepository classRepository)
        {
            _classRepository = classRepository;
        }

        [HttpGet]
        public async Task<IActionResult> ListClasses()
        {
            var classes = await _classRepository.ListAllClasses();
            if(classes == null)
            {
                return NotFound("No classes found");
            }
            return Ok(classes);
        }

        [HttpPost]
        public async Task<IActionResult> AddClass(ClassDTO classDto)
        {
            if (classDto == null)
            {
                return BadRequest("Provide ClassNumber");
            }

            var classObj = await _classRepository.AddClass(classDto);

            if (classObj == null)
            {
                return BadRequest("Error while adding class");
            }
            return Created(string.Empty, classObj);
        }

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetClassNumberById(string id)
        //{
        //    if (!Guid.TryParse(id, out var parsedId))
        //    {
        //        return BadRequest("The provided ID is not valid.");
        //    }

        //    var classNumber = await _classRepository.GetClassNumber(parsedId);

        //    if (!(classNumber.HasValue))
        //    {
        //        return NotFound("Provided division id not found");
        //    }

        //    return Ok(classNumber);
        //}
    }
}
