---
name: "2D Camera"
spine: "simple-2d-camera"
description: "How to create and implement a simple 2D camera for use in your projects"
date: "March 6, 2019"
index: 4
layout: "tutorials"
opengraph: {
    title: "2D Camera",
    description: "How to create and implement a simple 2D camera for use in your projects",
    image: "https://manbeardgames.com/img/tutorials/2d-camera/tutorial-cover.png",
    url: "https://manbeardgames.com/tutorials/2d-camera/"
}
---

# Overview
---
A camera can be an essential part of your game when you need to create game worlds that expand beyond the scope of the game windows width and height.  The concept of a camera can seem overwhelming at first, but here we'll layout the groundwork as simple as possible in a way that you can expand on to suite your game project's needs.

Creating a camera will require the use of vectors math and matrices math to create a Transformation Matrix.  It is beyond the scope of these tutorials to explain the math behind it. If you would like to further research this topic, the article [The Transform Matrix For 2D Games](http://www.alanzucconi.com/2016/02/10/tranfsormation-matrix/#part1) is a good starting place.  


# Project Files
---
If you would like to follow along with this tutorial using the same files and assets I use, you can find them [here on github](https://github.com/manbeardgames/manbeardgames-site-tutorials/tree/master/tutorials/2d-camera).
  


## Create the Camera Class
---
If you are unfamiliar with the concept of a camera in game development, it is gives us something called a Transformation Matrix, which we can then apply to our rendering.  This transformation matrix contains the information to translate, rotate, and scale what we tell to render so that it looks as if we're viewing the game from the perspective of the camera. 

![camera concept](tutorials/2d-camera/tutorial-cover.png)

To get started, create a new class for your camera, I'll call mine `Camera2D`.  Add the following:

```csharp
public class Camera2D
{
    //  The transformation matrix of the camera
    private Matrix _transformationMatrix = Matrix.Identity;

    //  The inverse of the transformation matrix
    private Matrix _inverseMatrix = Matrix.Identity;

    //  The xy-coordinate top-left position of the camera
    private Vector2 _position = Vector2.Zero;

    //  The rotation of the camera along the Z axis
    private float _rotation = 0;

    //  The x and y zoom level of the camera
    private Vector2 _zoom = Vector2.One;

    //  The xy-coordinate origin point of the camera
    private Vector2 _origin = Vector2.Zero;

    //  Has the position, angle, origin, or zoom of the camera changed
    private bool _hasChanged;

    //  The Viewport reference for the camera
    public Viewport Viewport;

    /// <summary>
    ///     Creates a new 2D camera instance
    /// </summary>
    /// <param name="viewPort">The Viewport reference for the camera</param>
    public Camera2D(Viewport viewPort)
    {
        Viewport = viewPort;
    }

    /// <summary>
    ///     Creates a new 2D camera instance
    /// </summary>
    /// <param name="width">The width of the viewport</param>
    /// <param name="height">The height of the viewport</param>
    public Camera2D(int width, int height)
    {
        Viewport = new Viewport();
        Viewport.Width = width;
        Viewport.Height = height;
    }

}
```

Below is an explanation the fields we've added above to further clarify their purpose for our camera.  


| Field | Type | Description |
|---|---|---|
| `_transformationMatrix` | Matrix | This is the matrix that we will calculate in a minute that includes our translation, rotation, and scale information.  This will be used by the `SpriteBatch` when we perform our rendering. |
| `_inverseMatrix` | Matrix | This is the inverse of our transformation matrix. |
| `_position` | Vector2 | This is the xy-coordinate position of our camera relative to the top-left of the camera's view. In terms of our transformation matrix, this is the **translation**/ |
| `_rotation` | float| This is the angle of rotation for our camera.  In terms of our transformation matrix, this is the **rotation**. |
| `_zoom` | Vector2 | This is the zoom level of the camera.  In terms of our transformation matrix, this is the **scale**. |
| `_origin` | Vector2 | This is the origin point of our camera. By default, it is Vector2.Zero, which means our camera's origin is the top-left. |
| `_hasChanged` | bool | This is a boolean value we'll set to true anytime either the position, rotation, or scale of the camera has changed, signifying that we need to update our transformation matrix. |
| `ViewPort` | ViewPort | This is the Viewport reference for our camera. |

After the fields are declared, two constructors are introduced.  The first constructor allows us to pass in a reference to an existing `ViewPort`.  This is useful because it allows us to use the Viewport from our Game1 class provided by default by MonoGame.  The second constructor allows use to supply a width and height, which will create a viewport reference for use base on these dimensions.


## Updating the Matrices
---
To keep our transformation matrix and inverse matrix updated, we'll create a method called `UpdateMatrices`.  Calculating a new transformation matrix is done through the multiplication of a translation matrix of our `_position`, a rotation matrix of our `_rotation`, a scale matrix of our `_zoom`, and an additional translation matrix of our `_origin`.  Once we have each of these individual matrices, we can multiply them all together to get our final `_transformationMatrix`.  Then to get the value of our `_inverseMatrix`, we just inverse the transformation matrix.

Add the following method to our Camera2D class

```csharp
/// <summary>
///     Updates the values for our transformation matrix and 
///     the inverse matrix.  
/// </summary>
private void UpdateMatrices()
{

    //  Create a translation matrix based on the position of the camera
    var positionTranslationMatrix = Matrix.CreateTranslation(new Vector3()
    {
        X = -(int)Math.Floor(_position.X),
        Y = -(int)Math.Floor(_position.Y),
        Z = 0
    });

    //  Create a rotation matrix around the Z axis
    var rotationMatrix = Matrix.CreateRotationZ(_rotation);

    //  Create a scale matrix based on the zoom
    var scaleMatrix = Matrix.CreateScale(new Vector3()
    {
        X = _zoom.X,
        Y = _zoom.Y,
        Z = 1
    });

    //  Create a translation matrix based on the origin position of the camera
    var originTranslationMatrix = Matrix.CreateTranslation(new Vector3()
    {
        X = (int)Math.Floor(_origin.X),
        Y = (int)Math.Floor(_origin.Y),
        Z = 0
    });

    //  Perform matrix multiplication of all of the above to create our
    //  transformation matrix
    _transformationMatrix = positionTranslationMatrix * rotationMatrix * scaleMatrix * originTranslationMatrix;

    //  Get our inverse matrix of the transformation matrix
    _inverseMatrix = Matrix.Invert(_transformationMatrix);

    //  Since the matrices have now been updated, set that there is no longer a change
    _hasChanged = false;
    
}
```

And that's it for the hard stuff.  This will keep the transformation and inverse matrix values updated whenever there is a change to the position, rotation, or scale.  Next, we'll create the public properties that can be used to retrieve the values needed from the camera to use within the game.

## Adding Camera Properties
---
The first two properties that we are going to add are for the TransformationMatrix and the InverseMatrix.  Add the following to the Camera2D class.

```csharp
/// <summary>
///     Gets the cameras transformation matrix
/// </summary>
public Matrix TransformationMatrix
{
    get
    {
        //  If a change is detected, update matrices before
        //  returning value
        if(_hasChanged)
        {
            UpdateMatrices();
        }
        return _transformationMatrix;
    }
}

/// <summary>
///     Gets the inverse of the camera's transformation matrix
/// </summary>
public Matrix InverseMatrix
{
    get
    {
        //  If a change is detected, update matrices before
        //  returning value
        if (_hasChanged)
        {
            UpdateMatrices();
        }
        return _inverseMatrix;
    }
}
```

Both of these just return their respective backing fields, however, before returning, they check if the `_hasChanged` boolean is true.  If it is, a call to update our matrices is performed first before returning the values. Next we'll add a few additional properties that will allow the adjustment of the camera's position, rotation, scale, and origin.  Add the following to the Camera2D class:

```csharp
/// <summary>
///     Gets or Sets the xy-coordinate position of the camera relative
///     to the world space of the game
/// </summary>
public Vector2 Position
{
    get { return _position; }
    set
    {
        //  If the value hasn't actually changed, just return back
        if (_position == value) { return; }

        //  Set the position value
        _position = value;

        //  Flag that a change has been made
        _hasChanged = true;
    }
}

/// <summary>
///     Gets or Sets the rotation angle of the camera
/// </summary>
public float Rotation
{
    get { return _rotation; }
    set
    {
        //  If the value hasn't actually changed, just return back
        if (_rotation == value) { return; }

        //  Set the rotation value
        _rotation = value;

        //  Flag that a change has been made
        _hasChanged = true;
    }
}

/// <summary>
///     Gets or Sets the zoom level of the camera
/// </summary>
public Vector2 Zoom
{
    get { return _zoom; }
    set
    {
        //  If the value hasn't actually changed, just return back
        if (_zoom == value) { return; }

        //  Set the zoom value
        _zoom = value;

        //  Flag that a change has been made
        _hasChanged = true;
    }
}

/// <summary>
///     Gets or Sets the origin point of the camera relative to the
///     ViewPort
/// </summary>
public Vector2 Origin
{
    get { return _origin; }
    set
    {
        //  If the value hasn't actually changed, just return back
        if (_origin == value) { return; }

        //  Set the origin value
        _origin = value;

        //  Flag that a change has been made
        _hasChanged = true;
    }
}

/// <summary>
///     Gets or Sets the camera's x-coordinate position relative to the world
///     space of the game
/// </summary>
public float X
{
    get { return _position.X; }
    set
    {
        //  If the value hasn't actually changed, just return back
        if (_position.X == value) { return; }

        //  Set the position x value
        _position.X = value;

        //  Flag that a change has been made
        _hasChanged = true;
    }
}

/// <summary>
///     Gets or Sets the camera's y-coordinate position relative to the world
///     space of the game
/// </summary>
public float Y
{
    get { return _position.Y; }
    set
    {
        //  If the value hasn't actually changed, just return back
        if (_position.Y == value) { return; }

        //  Set the position y value
        _position.Y = value;

        //  Flag that a change has been made
        _hasChanged = true;
    }
}
```

The getter for each of these properties return back their respective backing field values.  In each of the setters, first a check to see if the value has actually changed is performed.  If it is actually a new value, the value is set to the respective backing field, and the `_hasChanged` boolean is set to true, indicating that a change has been made.  The last two properties `X` and `Y` are mostly there for utility so we can set them individually instead of having to supply a full Vector2 each time to `Position`.  

That's it for our properties.  

## Screen Space to Camera Space Methods
---
By introducing a camera into our game, we've also created two separate coordinate spaces.  

| System | Definition |
|---|---|
| **World Space** | The World Space coordinate system defines the xy-coordinate location of the entities within our game's world. 
| **Screen Space** | The screen space coordinate system defines the xy-coordinate location relative to the game's window, with the top-left of the game window being xy-positiong {0, 0}.  This is the coordinate system things outside of our game, such as the players mouse, exist in. |

To further expand on this concept, take a look at the following image:



![world space to screen space concept](tutorials/2d-camera/world-to-screen-space.png)


On the left is our game world.  The game world is 2000px wide by 2000px tall.  In this game world, our player is located at world space xy-position {1000, 900}.  On the right is our game screen that is being rendered.  The game screen is only 1280px wide by 720px tall.  We have the mouse at screen space xy-position {1000, 650}.

We need something that is going to translate between these two coordinate systems. Thankfully, it's actually not too difficult.  In our Camera2D class, add the following two methods

```csharp
/// <summary>
///     Translate the given screen space xy-coordinate position
///     to the equivalent world space xy-coordinate position
/// </summary>
/// <param name="position">The xy-coordinate position in screen space to translate</param>
/// <returns>
///     The xy-coodinate position in world space
/// </returns>
public Vector2 ScreenToWorld(Vector2 position)
{
    return Vector2.Transform(position, InverseMatrix);
}

/// <summary>
///     Translates the given world space xy-coordinate position
///     to the equivalent screen space xy-coordinate position
/// </summary>
/// <param name="position">The xy-coordinate position in world space to translate</param>
/// <returns>
///     The xy-coordinate position in screen space
/// </returns>
public Vector2 WorldToScreen(Vector2 position)
{
    return Vector2.Transform(position, TransformationMatrix);
}
```

With these two methods, we can translate between the two coordinate systems.  

## Using the Camera
---
To use our camera in our game, first we need to create a new instance of the camera.  in our Game1 class and the following field and initialize it within the constructor.

```csharp
//  Our camera
Camera2D _camera;

public Game1()
{
    graphics = new GraphicsDeviceManager(this);
    Content.RootDirectory = "Content";

    
    //  Create our camera with 1280 with and 720 height
    _camera = new Camera2D(1280, 720);
}
```

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">Note</span>
    </div>
    <div class="card-body">
        <p>
            If you would like to instead create the camera using the <code>GraphicsDevice.ViewPort</code> from within Game1, you can do this, but you'll need to create the camera instead in the <code>Initialize()</code> method.  This is because you need the <code>GraphicsDevice</code> property to be set, which it will not be until Initialize is called.
        </p>
    </div>
</div>


Now, in our `Draw()` method, we need to pass the transformation matrix from the camera into the spritebatch when we call `sprtiebatch.Begin()` like so

```csharp
spriteBatch.Begin(transformMatrix: _camera.TransformationMatrix);

//  Draw things here

spriteBatch.End();
```

And that's it.  You now have a 2D camera that you can use in you game projects.  Don't stop here though, get creative. Think of some other things to add to your camera, like a way to smoothly move it from one position to another, or a way to "shake" it to give that sweet sweet screen shake effect. If you have some interesting things you added, let me know on [Twitter](http://www.twitter.com/manbeardgames) and I'll add them here (with your permission of course). 

And be sure to check out the project files for this tutorial on [Github](https://github.com/manbeardgames/manbeardgames-site-tutorials/tree/master/tutorials/2d-camera) for to see a completed example of using the camera and moving it around with the keyboard.