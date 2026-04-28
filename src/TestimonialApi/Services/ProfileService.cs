using TestimonialApi.DTOs;
using TestimonialApi.Models;

namespace TestimonialApi.Services;

public class ProfileService
{
    public ProfileResponse GetProfile(User user)
    {
        return new ProfileResponse
        {
            UserId = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email
        };
    }
}
