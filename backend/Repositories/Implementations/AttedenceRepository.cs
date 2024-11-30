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
    public class AttendenceRepository : IAttendenceRepository
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public AttendenceRepository(AppDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<AttendenceDTO>> ListAttendenceByDate(DateOnly attendenceDate)
        {
            Console.WriteLine(attendenceDate);
            var attendenceData = await _context.Attendences.Where(a => a.DeletedAt == null && a.AttendenceDate.ToDateTime(default) == attendenceDate.ToDateTime(default)).ToListAsync();
            Console.WriteLine("ATTENDENCE: ",attendenceData);

            var attendenceDtos = _mapper.Map<List<AttendenceDTO>>(attendenceData);
            return attendenceDtos;
        }

        public async Task<AttendenceDTO> AddAttendenceData(AttendenceDTO attendenceDto)
        {
            var attendenceObj = _mapper.Map<Attendence>(attendenceDto);
            attendenceObj.CreatedAt = DateTime.UtcNow;
            attendenceObj.UpdatedAt = DateTime.UtcNow;

            _context.Attendences.Add(attendenceObj);
            await _context.SaveChangesAsync();

            var createdAttendencetDto = _mapper.Map<AttendenceDTO>(attendenceObj);

            return createdAttendencetDto;
        }
    }
}