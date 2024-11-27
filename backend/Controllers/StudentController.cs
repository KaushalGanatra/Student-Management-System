using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using backend.Data;
using AutoMapper;
using FluentValidation.Results;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers
{
    [Route("api/student")]  
    [ApiController]
    public class StudentController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public StudentController(AppDbContext dbc, IMapper mapper)
        {
            _context = dbc;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> ListStudents()
        {
            var students = await _context.Students.Where(s => s.DeletedAt == null).ToListAsync();

            var studentDtos = _mapper.Map<List<StudentDTO>>(students);

            return Ok(studentDtos);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided ID is not valid.");
            }

            var student = await _context.Students.Where(s => s.DeletedAt == null && s.Id == parsedId).FirstOrDefaultAsync();

            if (student == null)
            {
                return NotFound("Provided student id not found");
            }

            var studentDtos = _mapper.Map<StudentDTO>(student);

            return Ok(studentDtos);
        }

        [HttpPost]
        public async Task<IActionResult> PostStudent([FromBody] StudentDTO studentDto)
        {
            if (studentDto == null)
            {
                return BadRequest("Student data is required.");
            }

            if (string.IsNullOrEmpty(studentDto.Name) ||
                !studentDto.Class.HasValue ||
                string.IsNullOrEmpty(studentDto.Division) ||
                string.IsNullOrEmpty(studentDto.Gender))
            {
                return BadRequest("Post request should contain all of the student data.");
            }

            var student = _mapper.Map<Student>(studentDto);

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            var createdStudentDto = _mapper.Map<StudentDTO>(student);

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, createdStudentDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(string id, [FromBody] StudentDTO studentDto)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided ID is not valid.");
            }

            var existingStudent = await _context.Students.Where(s => s.DeletedAt == null && s.Id == parsedId).FirstOrDefaultAsync();

            if (existingStudent == null)
            {
                return NotFound("Student with provided ID not found");
            }

            // for empty object
            if (string.IsNullOrEmpty(studentDto.Name) &&
                !studentDto.Class.HasValue &&
                string.IsNullOrEmpty(studentDto.Division) &&
                string.IsNullOrEmpty(studentDto.Gender))
            {
                return BadRequest("Student data is required");
            }

            Console.WriteLine("Gender: "+ existingStudent.Gender);

            existingStudent = _mapper.Map(studentDto, existingStudent);
            existingStudent.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(existingStudent);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided ID is not valid.");
            }

            var student = await _context.Students.Where(s => s.DeletedAt == null && s.Id == parsedId).FirstOrDefaultAsync();

            if (student == null)
            {
                return NotFound("Student not found");
            }

            student.DeletedAt = DateTime.UtcNow;
            student.UpdatedAt = DateTime.UtcNow;
            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
