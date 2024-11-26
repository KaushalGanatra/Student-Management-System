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
            var students = await _context.Students.ToListAsync();

            var studentDtos = _mapper.Map<List<StudentDTO>>(students);

            return Ok(studentDtos);
        }


        //[HttpGet("{id}")]
        //public async Task<IActionResult> getStudent(int id)
        //{
        //    var student = await _studentDbContext.Students.FindAsync(id);

        //    if (student == null)
        //    {
        //        return NotFound(); 
        //    }

        //    return Ok(student);
        //}

        //[HttpPost]
        //public async Task<IActionResult> postStudent([FromBody] Student student)
        //{
        //    if (student == null)
        //    {
        //        return BadRequest("Student data is required");
        //    }

        //    if (string.IsNullOrEmpty(student.Name) ||
        //        !student.Class.HasValue ||
        //        string.IsNullOrEmpty(student.Division) ||
        //        !student.Gender)

        //    {
        //        return BadRequest("Post request should contain all of the student data.");
        //    }

        //    _studentDbContext.Students.Add(student);
        //    await _studentDbContext.SaveChangesAsync();

        //    return CreatedAtAction(nameof(getStudent), new { id = student.Id }, student);
        //}

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

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> deleteStudent(int id)
        //{
        //    var student = await _studentDbContext.Students.FindAsync(id);

        //    if (student == null)
        //    {
        //        return NotFound();
        //    }

        //    _studentDbContext.Students.Remove(student);
        //    await _studentDbContext.SaveChangesAsync(); 

        //    return NoContent();
        //}
    }
}
