# Elements Interactive

This project is a simple example of how to pair [Hypar Elements](https://github.com/hypar-io/Elements) with a web front end using React + React-Three-Fiber.

## Server
The Server is a dotnet 8 ASP.net Minimal API that serves up a `/model` endpoint that returns a Hypar Model.

## Client
The Client is a Next.JS React app that uses [React-Three-Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) to render the model returned from the server, and [Leva](https://github.com/pmndrs/leva) to consume the inputs / parameters to drive model creation.

## How to start:
- First, open a codespace from this repository.  Use the green "Code" button, go to the Codespaces tab, and choose "Create codespace on main."
![Open Codespace](./docs/codespace.png)
- If you're just opening the codespace for the first time, give it a minute to get everything loaded / installed.
- Use the VS Code Command Palette (cmd/ctrl + shift + p) to "Run Task". Choose the "Start Client and Server" option.
- When you see the message "Your application running on port 3000 is available", click the "Open In Browser" button.
![Open In Browser](./docs/open-in-browser.png)


## Customizing
To build your own geometric logic, you'll need to make a few changes on the client and the sever. 
### Server (The geometry logic)
Edit `server/Program.cs`
```cs
app.MapPost("/cube", (ModelRequest request) =>
{
    var cube = new Mass(Polygon.Rectangle(Math.Max(0.1, request.Width), Math.Max(0.1, request.Depth)), Math.Max(0.1, request.Height))
    {
        Material = new Material("cube", request.Color)
    };
    var model = new Model();

    model.AddElement(cube);
    return model.ToResult();
});
```

You can edit this endpoint, or copy-paste to create a new one. Be sure to:
- give it a unique name
- define the inputs as a class (See `ModelRequest` and `GridRequest` for examples)
- create an `Elements.Model` and add objects to it
- return `model.ToResult()` at the end.

Note: sometimes hot reload can fail to recognize the new endpoint. In the `Terminal` tab at the bottom, try closing the `Start Server` terminal on the right, and running the `Start Server` task again. 

### Client (The UI logic)
Edit `client/src/components/ThreeDView.tsx`.

#### Add the component
Within the `<Canvas>` tag, add an instance of `<Model>`:
```js
<Model
    endpoint={'cube'} // This has to match your endpoint name in Program.cs
    parameters={cubeParameters} // we'll define this next
    onError={onError}
/>
```
#### Define the parameters

You can define the parameters directly inline at the top of `function ThreeDView`, before the `return`:
```ts
const cubeParameters = convertParameters({
    Width: 10,
    Depth: 20,
    Height: 10,
    Color: '#ff0000',
})
```
`convertParameters` handles making sure values like colors + 2d points get converted to a format the Elements library can understand.

You can also make the parameters interactive, by using `useControls` from the [Leva](https://github.com/pmndrs/leva) library:
```ts
const cubeParameters = convertParameters(
    useControls('cube', {
        Width: 10,
        Depth: 20,
        Height: 10,
        Color: '#ff0000',
    }))
```

This will display a UI that lets you edit the parameter values in realtime.