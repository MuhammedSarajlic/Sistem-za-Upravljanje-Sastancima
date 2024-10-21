using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services.UserService;

namespace server.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService userService;

    public UserController(IUserService userService){
        this.userService = userService;
    }

    [HttpGet]
    [Route("fetch")]
    public async Task<List<User>> GetAllUsers(){
        var users = await userService.GetAllUsers();

        return users;
    }

    [HttpGet]
    [Route("fetch/{userId:guid}")]
    public async Task<User> GetUserById(Guid userId){
        var user = await userService.GetUserById(userId);

        return user;
    }

    [HttpPost]
    [Route("create")]
    public async Task CreateUser(User user){
        await userService.CreateUser(user);
    }

    [HttpGet]
    [Route("find/{email}")]
    public async Task<List<User>> FindUserByEmail([FromRoute] string email){
        var res = await userService.FindUserByEmail(email);
        return res;
    }

    [HttpPut]
    [Route("update")]
    public async Task UpdateUser(User user){
        await userService.UpdateUser(user);
    }

    [HttpDelete]
    [Route("delete/{userId:guid}")]
    public async Task DeleteUser(Guid userId){
        await userService.DeleteUser(userId);
    }
}