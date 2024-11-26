using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using backend.Data;
using AutoMapper;

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
        public async Task<IActionResult> getStudent(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided UUID is not valid.");
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
        public async Task<IActionResult> postStudent([FromBody] StudentDTO studentDto)
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

            return CreatedAtAction(nameof(getStudent), new { id = student.Id }, createdStudentDto);
        }


        //[HttpPut("{id}")]
        //public async Task<IActionResult> putStudent(int id, [FromBody] Student student)
        //{
        //    var existingStudent = await _studentDbContext.Students.FindAsync(id);

        //    if (existingStudent == null)
        //    {
        //        return NotFound();
        //    }

        //    // for empty object
        //    if (string.IsNullOrEmpty(student.Name) &&
        //        !student.Class.HasValue &&
        //        string.IsNullOrEmpty(student.Division) &&
        //        string.IsNullOrEmpty(student.Gender))
        //    {
        //        return BadRequest("Student data is required");
        //    }

        //    existingStudent.Name = student.Name ?? existingStudent.Name; 
        //    if(student.Class != 0)
        //    existingStudent.Name = student.Name ?? existingStudent.Name; 
        //    {
        //        existingStudent.Class = student.Class ?? existingStudent.Class;
        //    }
        //    existingStudent.Division = student.Division ?? existingStudent.Division; 
        //    existingStudent.Gender = student.Gender ?? existingStudent.Gender;

        //    await _studentDbContext.SaveChangesAsync();

        //    return Ok(existingStudent);
        //}

        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteStudent(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                return BadRequest("The provided UUID is not valid.");
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
