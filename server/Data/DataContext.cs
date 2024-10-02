using server.Models;
using Microsoft.EntityFrameworkCore;

namespace server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<TextModel> TextModels => Set<TextModel>();
}