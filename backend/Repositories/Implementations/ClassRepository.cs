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
    public class ClassRepository : IClassRepository
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public ClassRepository(AppDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<ClassDTO>> ListAllClasses()
        {
            var query = _context.Class.Where(s => s.DeletedAt == null);

            var classes = await query.ToListAsync();
            var classDtos = _mapper.Map<List<ClassDTO>>(classes);
            return classDtos;
        }

        public async Task<ClassDTO> AddClass(ClassDTO classDto)
        {
            var classObj = _mapper.Map<Class>(classDto);
            classObj.CreatedAt = DateTime.UtcNow;
            classObj.UpdatedAt = DateTime.UtcNow;

            _context.Class.Add(classObj);
            await _context.SaveChangesAsync();

            var createdClasstDto = _mapper.Map<ClassDTO>(classObj);

            return createdClasstDto;
        }

        public int? GetClassNumberById(Guid id)
        {
            var classNumber = _context.Class.Where(c => c.DeletedAt == null && c.Id == id).Select(c => c.ClassNumber).FirstOrDefault();

            if (classNumber == 0)
            {
                return null;
            }

            return classNumber;
        }
    }
}
