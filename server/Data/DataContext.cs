using server.Models;
using Microsoft.EntityFrameworkCore;

namespace server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Meeting> Meetings => Set<Meeting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Meeting>()
            .HasMany(m => m.Participants)
            .WithMany(u => u.Meetings)
            .UsingEntity(j => j.ToTable("MeetingUsers"));
    }
}