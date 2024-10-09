using server.Models;
using server.Dtos;
using server.Response;

namespace server.Services.AuthService;

public interface IAuthService
{
    Task<User> Register(User user);
    Task<ApiResponse<UserDto>> Login(User user);
}