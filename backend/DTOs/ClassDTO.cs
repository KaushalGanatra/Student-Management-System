using backend.Models;

namespace backend.DTOs
{
	public class ClassDTO
	{
		public string? Id { get; set; }
		public required int ClassNumber { get; set; }
	}
}