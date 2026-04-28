using Microsoft.AspNetCore.Mvc;
using TestimonialApi.DTOs;
using TestimonialApi.Services;

namespace TestimonialApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly TestimonialService _testimonialService;

    public TestimonialsController(AuthService authService, TestimonialService testimonialService)
    {
        _authService = authService;
        _testimonialService = testimonialService;
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateTestimonialRequest request)
    {
        if (!_authService.IsValidToken(Request.Headers.Authorization))
            return Unauthorized();

        var user = _authService.GetDemoUser();
        var testimonial = _testimonialService.Create(user.Id, request);

        return Created($"/api/testimonials/{testimonial.Id}", testimonial);
    }

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, [FromBody] UpdateTestimonialRequest request)
    {
        if (!_authService.IsValidToken(Request.Headers.Authorization))
            return Unauthorized();

        var testimonial = _testimonialService.Update(id, request);

        if (testimonial is null)
            return NotFound();

        return Ok(testimonial);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        if (!_authService.IsValidToken(Request.Headers.Authorization))
            return Unauthorized();

        var deleted = _testimonialService.Delete(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
