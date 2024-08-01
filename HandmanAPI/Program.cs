var builder = WebApplication.CreateBuilder(args);

//Add Cors Policies
const string policyName = "CorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: policyName, builder =>
    {
        builder.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(policyName);

app.MapGet("/getRandomWord", () =>
{
    using var db = new HandmanContext();
    Random rnd = new Random();
    
    // var word = db.Words
    // .OrderBy(b => b.WordText)
    // .First();
    
    var wordList = db.Words.ToList();
    int r = rnd.Next(wordList.Count());


    return wordList[r];
})
.WithName("GetRandomWord")
.WithOpenApi();

app.Run();


