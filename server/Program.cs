using Elements;
using Elements.Geometry;
using ElementsServer;

var app = App.InitializeApp(args);

app.MapPost("/model", (ModelRequest request) =>
{
    var cube = new Mass(Polygon.Rectangle(Math.Max(0.1, request.Width), Math.Max(0.1, request.Depth)), Math.Max(0.1, request.Height))
    {
        Material = new Material("cube", request.Color)
    };
    var model = new Model();

    model.AddElement(cube);
    return model.ToResult();
});

app.Run();
class ModelRequest
{
    public double Width { get; set; }
    public double Depth { get; set; }
    public double Height { get; set; }
    public Color Color { get; set; }
}
