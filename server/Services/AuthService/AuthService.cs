using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Dtos;
using server.Response;

namespace server.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly DataContext _context;
    public AuthService(DataContext context){
        _context = context;
    }
    public async Task<ApiResponse<UserDto>> Login(User user)
    {
        var userDb = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
        if(userDb == null || !VerifyPassword(user.HashedPassword, userDb.HashedPassword)){
            return new ApiResponse<UserDto>(){
                Success = false,
                ErrorMessage = "Wrong credentials",
                Payload = null
            };
        }
        
        UserDto userDto = new UserDto
        {
            Id = userDb.Id,
            Name = userDb.Name,
            Email = userDb.Email,
        };

        return new ApiResponse<UserDto>(){
            Success = true,
            ErrorMessage = "",
            Payload = userDto
        };
    }

    public async Task<User> Register(User user)
    {
        user.HashedPassword = HashPassword(user.HashedPassword);
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return user;
    }

    private string HashPassword(string password)
    {
        string salt = BCrypt.Net.BCrypt.GenerateSalt(6);
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);
        return hashedPassword;
    }

    private bool VerifyPassword(string enteredPassword, string userPassword)
    {
        return BCrypt.Net.BCrypt.Verify(enteredPassword, userPassword);
    }
}