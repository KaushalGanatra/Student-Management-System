using AutoMapper;
using backend.Repositories.Implementations;
using backend.Repositories.Interfaces;
using backend.Models; 
using backend.DTOs;
using System.Numerics;

namespace backend.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapping from Student entity to StudentDTO
            CreateMap<Student, StudentDTO>()
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender.ToString()))  // Convert enum to string
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.Class, opt => opt.MapFrom<StudentClassNumberResolver>())
                .ForMember(dest => dest.Division, opt => opt.MapFrom<StudentDivisionNameResolver>());

            // Mapping from StudentDTO to Student (for PUT, PATCH, etc.)
            CreateMap<StudentDTO, Student>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Name)))  // Update only if not null or empty
                .ForMember(dest => dest.ClassId, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Class)))
                .ForMember(dest => dest.DivisionId, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Division)))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom<GenderResolver>()); // Use custom resolver for Gender

            CreateMap<ClassDTO, Class>();
            CreateMap<Class, ClassDTO>();

            CreateMap<DivisionDTO, Division>();
            CreateMap<Division, DivisionDTO>();
        }
    }

    public class StudentClassNumberResolver : IValueResolver<Student, StudentDTO, string>
    {
        private readonly IClassRepository _classRepository;

        public StudentClassNumberResolver(IClassRepository classRepository)
        {
            _classRepository = classRepository;
        }

        public string Resolve(Student source, StudentDTO destination, string destMember, ResolutionContext context)
        {
            if (source.ClassId == Guid.Empty) return "";  

            var classNumber = _classRepository.GetClassNumberById(source.ClassId);
            return classNumber.ToString(); 
        }
    }

    public class StudentDivisionNameResolver : IValueResolver<Student, StudentDTO, string>
    {
        private readonly IDivisionRepository _divisionRepository;

        public StudentDivisionNameResolver(IDivisionRepository divisionRepository)
        {
            _divisionRepository = divisionRepository;
        }

        public string Resolve(Student source, StudentDTO destination, string destMember, ResolutionContext context)
        {
            if (source.DivisionId == Guid.Empty) return ""; 

            var divisionName = _divisionRepository.GetDivisionNameById(source.DivisionId);
            return divisionName; 
        }
    }

    public class GenderResolver : IValueResolver<StudentDTO, Student, Gender>
    {
        public Gender Resolve(StudentDTO source, Student destination, Gender destMember, ResolutionContext context)
        {
            return !string.IsNullOrEmpty(source.Gender) ? ParseGenderFromString(source.Gender) : destMember;
        }

        private Gender ParseGenderFromString(string gender)
        {
            if (Enum.TryParse<Gender>(gender, true, out var parsedGender))  
            {
                return parsedGender;
            }

            return Gender.Undefined;
        }
    }
}