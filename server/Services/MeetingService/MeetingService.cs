using server.Data;
using server.Models;
using Microsoft.EntityFrameworkCore;

namespace server.Services.MeetingService;

public class MeetingService : IMeetingService
{
    private readonly DataContext _context;
    public MeetingService(DataContext context){
        _context = context;
    }

    public async Task<List<Meeting>> GetAllMeetings()
    {
        var meetings = await _context.Meetings.Include(p => p.Participants).ToListAsync();
        
        return meetings;
    }

    public async Task<List<Meeting>> GetMeetingByUserId(Guid userId)
    {
        var userMeetings = await _context.Meetings
                            .Where(m => m.Participants.Any(p => p.Id == userId))
                            .Include(p => p.Participants)
                            .ToListAsync();
    
        return userMeetings;
    }

    public async Task<List<Meeting>> GetMeetingsByUserIdWithDateRange(Guid userId, DateTime startDate, DateTime endDate)
    {
        return await _context.Meetings
            .Where(m => m.Participants.Any(p => p.Id == userId) && m.StartTime.Date >= startDate && m.StartTime.Date <= endDate)
            .Include(p => p.Participants)
            .ToListAsync();
    }

    public async Task<Meeting> GetMeetingById(Guid meetingId)
    {
        var meeting = await _context.Meetings.Include(p => p.Participants).FirstOrDefaultAsync(m => m.Id == meetingId);

        if(meeting != null){
            return meeting;
        }
        
        return null;
    }

    public async Task<Meeting> CreateMeeting(Meeting meeting)
    {
        var participants = await _context.Users
            .Where(u => meeting.ParticipantsIds.Contains(u.Id))
            .ToListAsync();

        meeting.Participants = participants;

        await _context.Meetings.AddAsync(meeting);
        await _context.SaveChangesAsync();

        return meeting;
    }

    public async Task<Meeting> UpdateMeeting(Meeting meeting)
    {
        _context.Meetings.Update(meeting);
        await _context.SaveChangesAsync();

        return meeting;
    }

    public async Task<Meeting> AddMeetingParticipants(List<Guid> participantsIds, Guid meetingId)
    {
        var meeting = await _context.Meetings.Include(p => p.Participants).FirstOrDefaultAsync(m => m.Id == meetingId);

        if(meeting != null){

            foreach(var participantId in participantsIds){
                meeting.ParticipantsIds.Add(participantId);
            }

            var participants = await _context.Users
                .Where(u => participantsIds.Contains(u.Id))
                .ToListAsync();
            
            foreach(var participant in participants){
                meeting.Participants.Add(participant);
            }

            _context.Update(meeting);
            await _context.SaveChangesAsync();

        }

        return meeting;  
    }

    public async Task<Meeting> RemoveMeetingParticipants(List<Guid> participantsIds, Guid meetingId)
    {
        var meeting = await _context.Meetings.Include(p => p.Participants).FirstOrDefaultAsync(m => m.Id == meetingId);

        if(meeting != null){

            foreach(var participantId in participantsIds){
                meeting.ParticipantsIds.Remove(participantId);
            }

            var participants = await _context.Users
                .Where(u => participantsIds.Contains(u.Id))
                .ToListAsync();
            
            foreach(var participant in participants){
                meeting.Participants.Remove(participant);
            }

            _context.Update(meeting);
            await _context.SaveChangesAsync();

        }

        return meeting;  
    }

    public async Task DeleteMeeting(Guid meetingId)
    {
        var meeting = await _context.Meetings.FindAsync(meetingId);

        _context.Meetings.Remove(meeting);
        await _context.SaveChangesAsync();
    }
}