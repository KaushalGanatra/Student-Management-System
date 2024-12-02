using FluentValidation;
using backend.DTOs;
using backend.Models;

public class StudentValidator : AbstractValidator<StudentDTO>
{
    public StudentValidator()
    {
        RuleFor(s => s.Gender).Must(BeAValidGender).WithMessage("Gender must be one of the following: Male, Female, Other").When(s => !string.IsNullOrEmpty(s.Gender));
    }

    private bool BeAValidGender(string? gender)
    {
        if (Enum.TryParse<Gender>(gender, true, out var parsedGender))
        {
            return parsedGender != Gender.Undefined;
        }
        return false;
    }

    private bool BeAValidDivision(string? division)
    {
        return division == "A" || division == "B" || division == "C";
    }
}