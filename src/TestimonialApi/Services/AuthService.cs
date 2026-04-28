using TestimonialApi.Models;

namespace TestimonialApi.Services;

public class AuthService
{
    private readonly User _demoUser = new();

    public User? ValidateUser(string email, string password)
    {
        if (_demoUser.Email.Equals(email, StringComparison.OrdinalIgnoreCase)
            && _demoUser.Password == password)
        {
            return _demoUser;
        }

        return null;
    }

    public string CreateToken(User user)
    {
        return $"demo-token-{user.Id}";
    }

    public bool IsValidToken(string? authorizationHeader)
    {
        if (string.IsNullOrWhiteSpace(authorizationHeader))
            return false;

        return authorizationHeader.StartsWith("Bearer demo-token-", StringComparison.OrdinalIgnoreCase);
    }

    public User GetDemoUser() => _demoUser;
}
