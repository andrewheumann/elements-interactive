using Elements;
using Elements.Serialization.glTF;
using Microsoft.AspNetCore.Http.Json;
namespace ElementsServer;

public static class App
{
    public static WebApplication InitializeApp(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        // Ensure properties are serialized/deserialized with uppercase names.
        builder.Services.Configure<JsonOptions>(options =>
        {
            options.SerializerOptions.PropertyNamingPolicy = null;
        });

        // Add permissive CORS policy. For a real app, you'd want to restrict
        // this to only the domains you expect to access the API.
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAnyOrigin",
                builder => builder.AllowAnyOrigin()
                                  .AllowAnyMethod()
                                  .AllowAnyHeader());
        });

        // Elements uses Newtonsoft rather than System.Text.Json, so we use it
        // here too.
        builder.Services.AddControllers()
            .AddNewtonsoftJson();

        var app = builder.Build();
        app.UseCors("AllowAnyOrigin");
        return app;
    }

    // Utility for converting a Model to an IResult.
    public static IResult ToResult(this Model model)
    {
        var gltfBytes = model.ToGlTF();
        var gltf = Convert.ToBase64String(gltfBytes);
        return Results.Ok(new { gltf });
    }
}