using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Dtos;
using server.Services.AuthService;

namespace server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService authService;

    public AuthController(IAuthService authService){
        this.authService = authService;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(User user){
        var userDB = await authService.Login(user);
        if (userDB.Success == false)
        {
            return BadRequest(new { message = userDB.ErrorMessage });
        }
        
        return Ok(userDB.Payload);
    }

    [HttpPost]
    [Route("register")]
    public async Task Register(User user){
        await authService.Register(user);
    }
}