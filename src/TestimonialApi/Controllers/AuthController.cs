using Microsoft.AspNetCore.Mvc;
using TestimonialApi.DTOs;
using TestimonialApi.Services;

namespace TestimonialApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _authService.ValidateUser(request.Email, request.Password);

        if (user is null)
            return Unauthorized("Invalid email or password.");

        return Ok(new LoginResponse
        {
            Token = _authService.CreateToken(user),
            UserId = user.Id,
            Email = user.Email
        });
    }
}
