namespace TestimonialApi.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FirstName { get; set; } = "Test";
    public string LastName { get; set; } = "User";
    public string Email { get; set; } = "tester@example.com";
    public string Password { get; set; } = "Tester123!";
}
