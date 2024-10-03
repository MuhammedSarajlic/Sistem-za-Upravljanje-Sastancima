using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Services.MeetingService;
using server.Services.UserService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(options =>
        options.UseMySql(builder.Configuration.GetConnectionString("SastanciDatabase"), 
        new MySqlServerVersion(new Version(8, 0, 21))));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMeetingService, MeetingService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();