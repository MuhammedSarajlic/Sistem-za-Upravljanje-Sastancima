using System.Text.Json.Serialization;

namespace server.Models;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string HashedPassword { get; set; } = string.Empty;

    [JsonIgnore]
    public List<Meeting>? Meetings { get; set; }
}