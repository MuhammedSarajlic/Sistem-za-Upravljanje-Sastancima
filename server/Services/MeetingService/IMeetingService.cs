using server.Models;

namespace server.Services.MeetingService;

public interface IMeetingService
{
    Task<List<Meeting>> GetAllMeetings();
    Task<List<Meeting>> GetMeetingByUserId(Guid userId);
    Task<List<Meeting>> GetMeetingsByUserIdWithDateRange(Guid userId, DateTime startDate, DateTime endDate);
    Task<Meeting> GetMeetingById(Guid meetingId);
    Task<Meeting> CreateMeeting(Meeting meeting);
    Task<Meeting> UpdateMeeting(Meeting meeting);
    Task<Meeting> AddMeetingParticipants(List<Guid> participantsIds, Guid meetingId);
    Task<Meeting> RemoveMeetingParticipants(List<Guid> participantsIds, Guid meetingId);
    Task DeleteMeeting(Guid meetingId);
}