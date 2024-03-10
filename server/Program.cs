using Elements;
using Elements.Geometry;
using Elements.Spatial;
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

// app.MapPost("/grid", (GridRequest request) =>
// {
//     var shape = Polygon.Rectangle(request.Size, request.Size);
//     var grid = new Grid2d(shape);
//     grid.U.DivideByCount(request.U);
//     grid.V.DivideByCount(request.V);
//     var cells = grid.GetCells().SelectMany(gc => gc.GetTrimmedCellGeometry());
//     var model = new Model();
//     var random = new Random(11);
//     var pt = request.Point;
//     foreach (var cell in cells)
//     {
//         if (cell is Polygon p)
//         {
//             var centroid = p.Centroid();
//             var distance = centroid.DistanceTo(pt);
//             model.AddElement(new Mass(p, Math.Max(0.1, request.Size + 2 - distance), random.NextMaterial(false)));
//         }
//     }
//     return model.ToResult();
// });

app.Run();
class ModelRequest
{
    public double Width { get; set; }
    public double Depth { get; set; }
    public double Height { get; set; }
    public Color Color { get; set; }
}

// class GridRequest
// {
//     public double Size { get; set; }
//     public int U { get; set; }
//     public int V { get; set; }
//     public Vector3 Point { get; set; }
// }