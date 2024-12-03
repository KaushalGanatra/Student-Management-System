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
    [Route("api/student")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;

        public StudentController(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> ListStudents(string? sClassId,string? sDivisionId)
        {
            var students = await _studentRepository.ListAllStudents(sClassId, sDivisionId);
            if (students == null || !students.Any())
            {
                return NotFound("No students found");
            }
            return Ok(students);
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent(StudentDTO studentDto)
        {
            var createdStudent = await _studentRepository.AddStudent(studentDto);
            if (createdStudent == null)
            {
                return NotFound("Provide all of the student details");
            }
            return Created(string.Empty, createdStudent);
        }

        //For Modifications and refector

        //[HttpPost]
        //public async Task<IActionResult> AddStudent(StudentDTO studentDto)
        //{
        //    if (studentDto == null)
        //    {
        //        return BadRequest("Provide Student data");
        //    }

        //    if (string.IsNullOrEmpty(studentDto.Name) ||
        //        !studentDto.Class.HasValue ||
        //        string.IsNullOrEmpty(studentDto.Division) ||
        //        string.IsNullOrEmpty(studentDto.Gender))
        //    {
        //        return BadRequest("Provide all of the student details");
        //    }

        //    var createdStudent = await _studentRepository.AddStudent(studentDto);
        //    if (createdStudent == null)
        //    {
        //        return StatusCode(500);
        //    }
        //    return CreatedAtAction(nameof(GetStudentById), new { id = createdStudent.Id }, createdStudent);
        //}

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided ID is not valid.");
            }

            var student = await _studentRepository.GetStudentById(parsedId);

            if (student == null)
            {
                return NotFound("Provided student id not found");
            }

            return Ok(student);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, [FromBody] StudentDTO studentDto)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided ID is not valid.");
            }

            var updatedStudent = await _studentRepository.UpdateStudent(parsedId,studentDto);

            if(updatedStudent==null)
            {
                return BadRequest("Student with provided ID not found");
            }

            return Ok(updatedStudent);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided ID is not valid.");
            }

            var isDeleted = await _studentRepository.DeleteStudent(parsedId);
            if (!isDeleted)
            {
                return NotFound("Student with provided ID not found");
            }

            return NoContent();
        }
    }
}
