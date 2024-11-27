using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Data;
using AutoMapper;
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

        public async Task<IEnumerable<StudentDTO>> GetAllStudents()
        {
            var students = await _context.Students.Where(s => s.DeletedAt == null).ToListAsync();
            var studentDtos = _mapper.Map<List<StudentDTO>>(students);
            return studentDtos;
        }

        //// Get a product by ID as a DTO
        //public ProductDTO GetProductById(int id)
        //{
        //    var product = _context.Products
        //        .Where(p => p.Id == id)
        //        .Select(p => new ProductDTO
        //        {
        //            Id = p.Id,
        //            Name = p.Name,
        //            Price = p.Price
        //        }).FirstOrDefault();

        //    return product;
        //}

        //// Add a new product
        //public void AddProduct(Product product)
        //{
        //    _context.Products.Add(product);
        //    _context.SaveChanges();
        //}

        //// Update an existing product
        //public void UpdateProduct(Product product)
        //{
        //    _context.Entry(product).State = EntityState.Modified;
        //    _context.SaveChanges();
        //}

        //// Delete a product by ID
        //public void DeleteProduct(int id)
        //{
        //    var product = _context.Products.Find(id);
        //    if (product != null)
        //    {
        //        _context.Products.Remove(product);
        //        _context.SaveChanges();
        //    }
        //}
    }
}
