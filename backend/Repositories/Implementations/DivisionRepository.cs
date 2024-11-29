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
    public class DivisionRepository : IDivisionRepository
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public DivisionRepository(AppDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<DivisionDTO>> ListAllDivisions()
        {
            var query = _context.Division.Where(s => s.DeletedAt == null);

            var divisions = await query.ToListAsync();
            var divisionDtos = _mapper.Map<List<DivisionDTO>>(divisions);
            return divisionDtos;
        }

        public async Task<DivisionDTO> AddClass(DivisionDTO divisionDto)
        {
            var divisionObj = _mapper.Map<Division>(divisionDto);
            divisionObj.UpdatedAt = DateTime.UtcNow;

            _context.Division.Add(divisionObj);
            await _context.SaveChangesAsync();

            var createdDivisiontDto = _mapper.Map<DivisionDTO>(divisionObj);

            return createdDivisiontDto;
        }
    }
}
