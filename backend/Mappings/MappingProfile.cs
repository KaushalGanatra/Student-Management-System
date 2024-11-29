using AutoMapper;
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
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));

            // Mapping from StudentDTO to Student (for PUT, PATCH, etc.)
            CreateMap<StudentDTO, Student>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Name)))  // Update only if not null or empty
                .ForMember(dest => dest.Class, opt => opt.Condition(src => src.Class.HasValue))  
                .ForMember(dest => dest.Division, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Division))) 
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())  
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow)) 
                .ForMember(dest => dest.Gender, opt => opt.MapFrom<GenderResolver>()); // Use custom resolver for Gender

            CreateMap<ClassDTO, Class>();
            CreateMap<Class, ClassDTO>();

            CreateMap<DivisionDTO, Division>();
            CreateMap<Division, DivisionDTO>();
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