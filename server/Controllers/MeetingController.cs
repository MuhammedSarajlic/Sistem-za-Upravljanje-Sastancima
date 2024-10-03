using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.MeetingService;

namespace server.Controllers;

[ApiController]
[Route("api/meetings")]
public class MeetingController : ControllerBase
{
    private readonly IMeetingService meetingService;

    public MeetingController(IMeetingService meetingService){
        this.meetingService = meetingService;
    }

    [HttpGet]
    [Route("fetch")]
    public async Task<List<Meeting>> GetAllMeetings(){
        var meetings = await meetingService.GetAllMeetings();
        return meetings;
    }

    [HttpGet]
    [Route("fetch/{meetingId:guid}")]
    public async Task<Meeting> GetMeetingById(Guid meetingId){
        var meeting = await meetingService.GetMeetingById(meetingId);
        return meeting;
    }

    [HttpGet]
    [Route("fetch/user/{userId:guid}")]
    public async Task<List<Meeting>> GetMeetingByUserId(Guid userId){
        var meetings = await meetingService.GetMeetingByUserId(userId);
        return meetings;
    }


    [HttpPost]
    [Route("create")]
    public async Task CreateMeeting([FromBody] Meeting meeting){
        await meetingService.CreateMeeting(meeting);
    }

    [HttpPut]
    [Route("update")]
    public async Task UpdateMeeting([FromBody] Meeting meeting){
        await meetingService.UpdateMeeting(meeting);
    }

    [HttpPut]
    [Route("update/add-participants")]
    public async Task AddMeetingParticipants([FromBody] List<Guid> participantsIds, [FromQuery] Guid meetingId){
        await meetingService.AddMeetingParticipants(participantsIds, meetingId);
    }

    [HttpPut]
    [Route("update/remove-participants")]
    public async Task RemoveMeetingParticipants([FromBody] List<Guid> participantsIds, [FromQuery] Guid meetingId){
        await meetingService.RemoveMeetingParticipants(participantsIds, meetingId);
    }

    [HttpDelete]
    [Route("delete/{meetingId:guid}")]
    public async Task DeleteMeeting(Guid meetingId){
        await meetingService.DeleteMeeting(meetingId);
    }
}