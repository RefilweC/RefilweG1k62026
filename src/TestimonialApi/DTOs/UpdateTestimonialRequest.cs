namespace TestimonialApi.DTOs;

public class UpdateTestimonialRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int Rating { get; set; }
}
