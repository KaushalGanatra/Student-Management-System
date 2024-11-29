using FluentValidation;
using backend.DTOs;
using backend.Models;

public class ClassValidator : AbstractValidator<ClassDTO>
{
    public ClassValidator()
    {
        RuleFor(c => c.ClassNumber).NotEmpty();
        RuleFor(c => c.ClassNumber).GreaterThan(0).WithMessage("Class must be a valid positive integer (no decimals or negative numbers)");
    }
}