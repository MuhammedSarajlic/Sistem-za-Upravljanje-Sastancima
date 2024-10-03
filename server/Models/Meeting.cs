namespace server.Models;

public class Meeting
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    //Reference for participants
    public List<Guid>? ParticipantsIds { get; set; }
    public List<User>? Participants { get; set; }
}