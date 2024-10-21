using server.Models;

namespace server.Services.UserService;

public interface IUserService
{
    Task<List<User>> GetAllUsers();
    Task<User> GetUserById(Guid userId);
    Task<User> CreateUser(User user);
    Task<List<User>> FindUserByEmail(string email);
    Task<User> UpdateUser(User user);
    Task<User> DeleteUser(Guid userId);
}