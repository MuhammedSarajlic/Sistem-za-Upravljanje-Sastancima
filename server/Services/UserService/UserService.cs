using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services.UserService;

public class UserService : IUserService
{
    private readonly DataContext _context;
    public UserService(DataContext context){
        _context = context;
    }

    public async Task<List<User>> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();

        return users;
    }

    public async Task<User> GetUserById(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);

        return user;
    }

    public async Task<User> CreateUser(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<List<User>> FindUserByEmail(string email)
    {
        return await _context.Users
            .Where(u => u.Email.Contains(email))
            .Take(3)                              
            .ToListAsync();
    }


    public async Task<User> UpdateUser(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User> DeleteUser(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if(user != null){
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        return user;
    }
}