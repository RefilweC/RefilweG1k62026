using Microsoft.AspNetCore.Mvc;
using TestimonialApi.Services;

namespace TestimonialApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ProfileService _profileService;

    public ProfileController(AuthService authService, ProfileService profileService)
    {
        _authService = authService;
        _profileService = profileService;
    }

    [HttpGet]
    public IActionResult GetProfile()
    {
        if (!_authService.IsValidToken(Request.Headers.Authorization))
            return Unauthorized();

        var user = _authService.GetDemoUser();
        var profile = _profileService.GetProfile(user);

        return Ok(profile);
    }
}
