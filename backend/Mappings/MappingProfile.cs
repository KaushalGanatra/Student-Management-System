using AutoMapper;
using backend.Models;
using backend.DTOs;

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
                .ForMember(dest => dest.Name, opt => opt.Condition(src => src.Name != null))  // Update only if not null
                .ForMember(dest => dest.Class, opt => opt.Condition(src => src.Class.HasValue))  // Update only if not null
                .ForMember(dest => dest.Division, opt => opt.Condition(src => src.Division != null))  // Update only if not null
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => ParseGenderFromString(src.Gender)))  // Convert string to Gender enum
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())  // Prevent updating CreatedAt
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));  // Set UpdatedAt to current timestamp
        }

        // Helper method to parse Gender string to Gender enum
        private Gender? ParseGenderFromString(string gender)
        {
            if (Enum.TryParse<Gender>(gender, true, out var parsedGender))  // Ignore case when parsing
            {
                return parsedGender;
            }

            return Gender.Male;  // Default to Gender.Male if parsing fails or gender is invalid
        }
    }
}
