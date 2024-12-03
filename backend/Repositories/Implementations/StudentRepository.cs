using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Data;
using AutoMapper;
using FluentValidation.Results;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class StudentRepository : IStudentRepository
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public StudentRepository(AppDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<StudentDTO>> ListAllStudents(string? sClassId, string? sDivisionId)
        {
            var query = _context.Students.Where(s => s.DeletedAt == null);

            if (!string.IsNullOrEmpty(sClassId) && Guid.TryParse(sClassId, out var classGuid))
            {
                query = query.Where(s => s.ClassId == classGuid);
            }

            if (!string.IsNullOrEmpty(sDivisionId) && Guid.TryParse(sDivisionId, out var divisionGuid))
            {
                query = query.Where(s => s.DivisionId == divisionGuid);
            }

            var students = await query.ToListAsync();
            var studentDtos = _mapper.Map<List<StudentDTO>>(students);
            return studentDtos;
        }


        public async Task<StudentDTO?> GetStudentById(Guid id)
        {
            var student = await _context.Students.Where(s => s.DeletedAt == null && s.Id == id).FirstOrDefaultAsync();

            if (student == null)
            {
                return null;
            }

            var studentDto = _mapper.Map<StudentDTO>(student);

            return studentDto;
        }

        public async Task<StudentDTO?> AddStudent(StudentDTO studentDto)
        {
            if (studentDto == null)
            {
                return null;
            }

            if (string.IsNullOrEmpty(studentDto.Name) ||
                string.IsNullOrEmpty(studentDto.Class) ||
                string.IsNullOrEmpty(studentDto.Division) ||
                string.IsNullOrEmpty(studentDto.Gender))
            {
                return null;
            }

            var student = _mapper.Map<Student>(studentDto);
            student.UpdatedAt = DateTime.UtcNow;

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            var createdStudentDto = _mapper.Map<StudentDTO>(student);

            return createdStudentDto;
        }

        //For Modifications and refector

        //public async Task<StudentDTO?> AddStudent(StudentDTO studentDto)
        //{
        //    var student = _mapper.Map<Student>(studentDto);
        //    student.UpdatedAt = DateTime.UtcNow;

        //    _context.Students.Add(student);
        //    await _context.SaveChangesAsync();

        //    var createdStudentDto = _mapper.Map<StudentDTO>(student);

        //    return createdStudentDto;
        //}

        public async Task<StudentDTO?> UpdateStudent(Guid id, StudentDTO studentDto)
        {
            var existingStudent = await _context.Students.Where(s => s.DeletedAt == null && s.Id == id).FirstOrDefaultAsync();

            if (existingStudent == null)
            {
                return null;
            }

            //empty object
            if (string.IsNullOrEmpty(studentDto.Name) &&
                string.IsNullOrEmpty(studentDto.Class) &&
                string.IsNullOrEmpty(studentDto.Division) &&
                string.IsNullOrEmpty(studentDto.Gender))
            {
                return null;
            }
            existingStudent = _mapper.Map(studentDto,existingStudent);
            existingStudent.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            Console.WriteLine("EXISTING: "+existingStudent);
            return _mapper.Map<StudentDTO>(existingStudent); 
        }

        public async Task<bool> DeleteStudent(Guid id)
        {
            var student = await _context.Students.Where(s => s.DeletedAt == null && s.Id == id).FirstOrDefaultAsync();
            if (student == null)
            {
                return false;
            }
            student.DeletedAt = DateTime.UtcNow;
            student.UpdatedAt = DateTime.UtcNow;
            _context.Students.Update(student);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
