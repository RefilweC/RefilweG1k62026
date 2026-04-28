using TestimonialApi.DTOs;
using TestimonialApi.Models;

namespace TestimonialApi.Services;

public class TestimonialService
{
    private readonly List<Testimonial> _testimonials = new();

    public Testimonial Create(Guid userId, CreateTestimonialRequest request)
    {
        var testimonial = new Testimonial
        {
            UserId = userId,
            Title = request.Title,
            Message = request.Message,
            Rating = request.Rating
        };

        _testimonials.Add(testimonial);
        return testimonial;
    }

    public Testimonial? Update(Guid id, UpdateTestimonialRequest request)
    {
        var testimonial = _testimonials.FirstOrDefault(x => x.Id == id);

        if (testimonial is null)
            return null;

        testimonial.Title = request.Title;
        testimonial.Message = request.Message;
        testimonial.Rating = request.Rating;
        testimonial.UpdatedAtUtc = DateTime.UtcNow;

        return testimonial;
    }

    public bool Delete(Guid id)
    {
        var testimonial = _testimonials.FirstOrDefault(x => x.Id == id);

        if (testimonial is null)
            return false;

        _testimonials.Remove(testimonial);
        return true;
    }
}
