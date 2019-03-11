---
title: AABB 2D Collision Checks
short: How to create a simple check for 2D collision using Axis-Aligned Bounding Box (AABB)
layout: default
publish: ok
index: 102
date: March 7, 2019
ogtitle: AABB 2D Collision Checks
ogimage: https://manbeardgames.com/img/tutorials/aabb-2d-collision-checks/tutorial-cover.png
ogdescription: How to create a simple check for 2D collision using Axis-Aligned Bounding Box (AABB)
---
<div class="container post">

# Overview
---
in this tutorial, we're going to discuss Axis-Aligned Bounding Box (AABB) collision detection between 2D objects in MonoGame.  Collision detection in game programming can be as complicated as you want it, or as simple as you need it.  There are frameworks out there that can assist in getting you up and going with collision detection such as the [FarSeer Physics Engine](https://archive.codeplex.com/?p=farseerphysics) (which is now [Velcro Physics](https://github.com/VelcroPhysics/VelcroPhysics) though that version is still under construction). There's also the [MonoGame.Extended Framework](https://github.com/craftworkgames/MonoGame.Extended) and the [Nez Framework](https://github.com/prime31/Nez), both of which have collision systems. All of these are excellent tools that you can use.

**Axis-Aligned Bounding Box, or AABB, allows us to recognize a collision has occurred between two defined rectangular areas.  There are other methods of collision detection for circular collision and n-gon collision. Those will be covered in a future tutorial and will not be within the scope of this one.**

# Project Files
---
If you would like to follow along with this tutorial using the same files and assets I use, you can find them [here on github](https://github.com/manbeardgames/manbeardgames-site-tutorials/tree/master/tutorials/aabb-2d-collision-checks).

## Defining Collision
---
Before we can get started on the fun code stuff, we first need to talk about what collision is.  At its most basic definition, it is when defined areas within your game overlap.  

![not colliding versus colliding](tutorial-cover.png)

In the image above there are two scenarios.  The scenario on the left shows two defined rectangular areas, red and green.  These defined areas do no overlap, so this does not define a collision.  In the scenario on the right, the defined red and green areas do overlap, so this would define a collision.

The method of detecting collision we'll be using, as stated previously, is called Axis-Aligned Bounding Box.  A **Bounding Box** is just a 2D rectangle whose position and area contain the object that is collidable.  **Axis-Aligned** means that our bounding boxes are aligned on the same coordinate system.   

So, now that we have defined what a collision means, how do we detect it?

## Detecting a Collision
---
For AABB collision detection to say that there was a collision between two bounding boxes, there is a simple checklist.  

1. Is the x-coordinate position of the left edge of Bounding Box 1 less than the x-coordinate position of the right edge of Bounding Box 2?
2. Is the x-coordinate position of the right edge of Bounding Box 1 greater than the x-coordinate position of the left edge of Bounding Box 2?
3. Is the y-coordinate position of the top edge of Bounding Box 1 less than the y-coordinate position of the bottom edge of Bounding Box 2?
4. is the y-coordinate position of the bottom edge of Bounding Box 1 greater than the y-coordinate position of the top edge of Bounding Box 2?

If you can answer yes to all four of these questions, then a collision is detected.  If any of those answers is no, even if it's just one of them, then no collision is detected.  Look at the following images to further illustrate this.

![collision failure one](collision-fail-1.png)

![collision failure two](collision-fail-2.png)

![collision success](collision-success.png)

Since all four of the questions we must ask are just yes/no questions, we can easily translate this into an if statement in our code to perform the check. The following is an example of this

```csharp
public bool CheckCollision(BoundingBox bb1, BoundingBox bb2)
{
    if(bb1.Left < bb2.Right && bb1.Right > bb2.Left && bb1.Top < bb2.Bottom && bb1.Bottom > bb2.Top)
    {
        return true;
    }
    else
    {
        return false;
    }
}
```

And that's it. Super simple.   Now let's apply this to a MonoGame project. If you need to, go ahead and create a new MonoGame Cross Platform Desktop project.

## The Bounding Box Class
---
The first thing we're going to make is the `BoundingBox` class.  Create the new class and add the following properties and constructor

```csharp
/// <summary>
///     Gets or Sets the xy-coordinate top-left position
///     of the bounding box
/// </summary>
public Vector2 Position
{
    get { return _position; }
    set { _position = value; }
}
private Vector2 _position;

/// <summary>
///     The width of the bounding box
/// </summary>
public float Width { get; set; }

/// <summary>
///     The height of the bounding box
/// </summary>
public float Height { get; set; }


/// <summary>
///     Creates a new bounding box instance
/// </summary>
/// <param name="position">The position of the bounding box</param>
/// <param name="width">The width of the bounding box</param>
/// <param name="height">The height of the bounding box</param>
public BoundingBox(Vector2 position, float width, float height)
{
    //  Set the properties
    _position = position;
    Width = width;
    Height = height;
}
```

The following table further explains the properties setup  

| Property | Type | Description |
|---|---|---|
| `Position` | Vector2 | This is the xy-coordinate location of the top-left of the bounding box.  Whenever the object moves that the bounding box is containing, you'll need to be sure to update this value |
| `Width`| float | This is the width of our bounding box.  |
| `Height` | float | This is the height of our bounding box

The constructor takes in a `Vector2 position`, `float width`, and `float height` values. These three values must be set at minimum for our bounding box to exist. 

Now that we have these three basic properties of our bounding box, lets add a couple of utility properties.  When we want to reference the x-coordinate for the right edge of the bounding box, we don’t want to have to say `_position.X + Width` every time.  Instead we'll just define the properties  that do it for us.  Add the following properties to the BoundingBox class

```csharp
/// <summary>
///     Gets or Sets the y-coordinate position of the top
///     edge of the bounding box
/// </summary>
public float Top
{
    get { return _position.Y; }
    set { _position.Y = value; }
}

/// <summary>
///     Gets or Sets the y-coordinate position of the bottom
///     edge of the bounding box
/// </summary>
public float Bottom
{
    get { return _position.Y + Height; }
    set { _position.Y = value - Height; }
}

/// <summary>
///     Gets or Sets the x-coordinate position of the left
///     edge of the bounding box
/// </summary>
public float Left
{
    get { return _position.X; }
    set { _position.X = value; }
}

/// <summary>
///     Gets or Sets the x-coordinate position of the right
///     edge of the bounding box
/// </summary>
public float Right
{
    get { return _position.X + Width; }
    set { _position.X = value - Width; }
}
```

Now when we need to reference an edge of the bounding box, we can simply just call `Top`, `Bottom`, `Left`, or `Right`.  Next, we'll need to create the method that performs the actual AABB collision check.  Add the following method to the BoundingBox class

```csharp
/// <summary>
///     Performs Axis-Aligned Bounding Box collision check against another
///     BoundingBox
/// </summary>
/// <param name="other">The other BoundingBox to check if this and that one is colliding</param>
/// <returns>
///     True if they are colliding; otherwise false.
/// </returns>
public bool CollisionCheck(BoundingBox other)
{
    // 1. Is the left edge of this BoundingBox less than the right edge of the other BoundingBox
    // 2. Is the right edge of this BoundingBox greater than the left edge of the other BoundingBox
    // 3. Is the top edge of this BoundingBox less than the bottom edge of the other BoundingBox
    // 4. Is the bottom edge of this BoundingBox greater than the top edge of the other BoundingBox
    if(
        this.Left < other.Right &&
        this.Right > other.Left &&
        this.Top < other.Bottom &&
        this.Bottom > other.Top)
    {
        return true;
    }
    else
    {
        return false;
    }
}
```

Anytime we want to check if two `BoundingBox` objects are colliding, we just call `CollisionCheck` from one of them and supply it with the other one.  Before we put this to use though, lets add one last property to our `BoundingBox` class for utility.  This property will return a `Rectangle` that we can use later in a spritebatch to render the bounding box and see it. Add the following to the `BoundingBox` class.

```csharp
/// <summary>
///     Gets a Rectangle representation of this BoundingBox
/// </summary>
public Rectangle Bounds
{
    get
    {
        return new Rectangle((int)Left, (int)Top, (int)Width, (int)Height);
    }
}
```

## Using the BoundingBox Class
---
Now that we have all the pieces in place, let's put it to work so we can see it in action.  In `Game1`, we're going to add two new fields `_boundingBox` and `_otherBoundingBox`.  We'll see the initial position of `_boundingBox` to be on the left side of the screen, and `_otherBoundingBox` to be in the center of the screen.  Next, in our `Update` method, we'll add logic, so we can move `_boundingBox` around the screen.  And finally, in our `Draw` method, we'll render both bounding boxes. We'll add logic so that a collision check is made, if a collision is detected, they will both render red, otherwise they'll render green.

To start, add the following fields to `Game1` and initialize them within the constructor

```csharp
//  This is the bounding box that we'll move around
private BoundingBox _boundingBox;

//  This is the bounding box that will be stationary in
//  the center of the screen
private BoundingBox _otherBoundingBox;

//  The width of our screen
private int _screenWidth = 1280;

//  The height of our screen
private int _screenHeight = 720;

//  This is a 1x1 texture that we'll use as the 
//  texture when we render our bounding boxes
private Texture2D _pixel;

public Game1()
{
    graphics = new GraphicsDeviceManager(this);
    Content.RootDirectory = "Content";

    //  Create the first bounding box at the right edge of the screen. By multiplying
    //  the position by 0.5f, we put it at center height
    _boundingBox = new BoundingBox(new Vector2(0, _screenHeight) * 0.5f, 50, 50);

    //  Create the second boundinb box at the center of the screen.
    _otherBoundingBox = new BoundingBox(new Vector2(_screenWidth, _screenHeight) * 0.5f, 50, 50);


    //  The following is just to actually set the screen width and height
    graphics.PreferredBackBufferWidth = _screenWidth;
    graphics.PreferredBackBufferHeight = _screenHeight;
    graphics.ApplyChanges();
}
```

<div class="card text-white bg-dark mt-3 mb-3">
    <div class="card-header">
        <span class="lead">Note</span>
    </div>
    <div class="card-body">
        <p>
            In the code above, in the constructor, I set the <code>graphics.PreferredBackBufferWidth</code> and <code>graphics.PreferredBackBufferHeight</code> properties, then called <code>graphics.ApplyChanges()</code>.  This allows me to set the width and height of the game screen at the start to the desired 1280 x 720 for this example. This isn't part of the tutorial, just wanted to explain it in case you were wondering why I added coded if you didn't know what it did.
        </p>
    </div>
</div>

Now that we have our two `BoundingBox` fields, let add code in the `Update` method that will allow us to move the first one around the screen.  We'll perform keyboard input detection for the arrow keys and adjust the position of `_boundingBox` accordingly.  After adjusting the position, we'll also perform a check using our utility properties we created to ensure that it can't leave the confines of the screen. Add the following to the `Update` method.

```csharp
/// <summary>
/// Allows the game to run logic such as updating the world,
/// checking for collisions, gathering input, and playing audio.
/// </summary>
/// <param name="gameTime">Provides a snapshot of timing values.</param>
protected override void Update(GameTime gameTime)
{
    if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
        Exit();

    //  Get the delta time between current and previous update frame
    float deltaTime = (float)gameTime.ElapsedGameTime.TotalSeconds;

    //  The speed rate at which we'll move _boundingBox
    float speed = 200.0f;

    //  Get the state of the keyboard
    var keyboardState = Keyboard.GetState();

    //  Check for input on the arrow keys and move the _boundingBox accordingly
    if(keyboardState.IsKeyDown(Keys.Up))
    {
        _boundingBox.Position -= Vector2.UnitY * speed * deltaTime;
    }
    else if(keyboardState.IsKeyDown(Keys.Down))
    {
        _boundingBox.Position += Vector2.UnitY * speed * deltaTime;
    }

    if (keyboardState.IsKeyDown(Keys.Left))
    {
        _boundingBox.Position -= Vector2.UnitX * speed * deltaTime;
    }
    else if (keyboardState.IsKeyDown(Keys.Right))
    {
        _boundingBox.Position += Vector2.UnitX * speed * deltaTime;
    }

    //  This is to prevent the _boundingBox from leaving the edges of the screen
    if (_boundingBox.Left <= 0) { _boundingBox.Left = 0; }
    else if (_boundingBox.Right >= _screenWidth) { _boundingBox.Right = _screenWidth; }

    if (_boundingBox.Top <= 0) { _boundingBox.Top = 0; }
    if (_boundingBox.Bottom >= _screenHeight) { _boundingBox.Bottom = _screenHeight; }
    
    base.Update(gameTime);
}
```

Before we can draw the bounding boxes to the screen, we will need a `Texture2D`.  We already have the `_pixel` Texture2D field that we above, so we just need to initialize it in the `LoadContent` method.  We'll create it as a 1x1 texture with the color being white.  Add the following to the `LoadContent` method

```csharp
/// <summary>
/// LoadContent will be called once per game and is the place to load
/// all of your content.
/// </summary>
protected override void LoadContent()
{
    // Create a new SpriteBatch, which can be used to draw textures.
    spriteBatch = new SpriteBatch(GraphicsDevice);

    //  Create a new 1x1 Texture2D
    _pixel = new Texture2D(GraphicsDevice, 1, 1);

    //  Set the color data for the Texture2D as White
    _pixel.SetData<Color>(new Color[] { Color.White });

}
```

For the last piece, we need to update the `Draw` method.  Here, we'll call the `CheckCollision` method from `_boundingBox` and pass in `_otherBoundingBox`.  If a collision is detected, we'll render both boxes in the color red.  If no collision is detected, then we'll render them in green.  We'll also make use of the `Bounds` utility property we created for our `BoundingBox` class to get a rectangle that we can use to with spritebatch to render our bounding boxes. 

Add the following to the `Draw` method

```csharp
/// <summary>
/// This is called when the game should draw itself.
/// </summary>
/// <param name="gameTime">Provides a snapshot of timing values.</param>
protected override void Draw(GameTime gameTime)
{
    //  Changed this to Black.
    GraphicsDevice.Clear(Color.Black);

    spriteBatch.Begin();

    //  Check if there is a collision. If so, render the BoundingBoxes as red.
    //  Otherwise render them as green
    if(_boundingBox.CollisionCheck(_otherBoundingBox))
    {
        spriteBatch.Draw(_pixel, _boundingBox.Bounds, Color.Red);
        spriteBatch.Draw(_pixel, _otherBoundingBox.Bounds, Color.Red);
    }
    else
    {
        spriteBatch.Draw(_pixel, _boundingBox.Bounds, Color.Green);
        spriteBatch.Draw(_pixel, _otherBoundingBox.Bounds, Color.Green);
    }

    spriteBatch.End();

    base.Draw(gameTime);
}
```

If you run the game now, you'll see our two bounding boxes on the screen.  You can move the one on the left using the Up, Down, Left, Right arrow keys on your keyboard.  If they are not colliding with each other, they will both remain green.  When they collide, they will change to red.

## Beyond this Tutorial
That is really it for the scope of this tutorial for now.  We've created a simple method of performing Axis-Aligned Bounding Box collision detection.  I feel now however you may have question.  Question such as "How do I use this to prevent objects from overlapping when a collision is detected?".  The answer to that question is a different part of collision systems called **Collision Resolution**.  While I did not discuss it here, you have the tools now to add this piece yourself.  You could, for instance, perform the collision check after calculating the new position of the object. If the check is true, then don't allow the object to move there. Or allow it to move just closest point before colliding.  Or maybe your question is "How would I bounce an object off another after colliding?", in which case that would require a whole other tutorial.  However, as I said, you know have the basic element in place to get all that going, the actual detection of the collision.

Another thing we did not discuss here is how to detect the collision of a circular bounding box versus a rectangular bounding box, or circle vs circle.  We also didn't discuss collision detection using n-gons, objects like triangles, or diamonds, etc.  These are things we'll discuss in a future tutorial, so keep a look out for that.  

Be sure to download the project files mentioned at the beginning to see the completed example of this tutorial.  

As always, I hope this was helpful for you. If you have any questions or feedback on this tutorial, please let me know on [Twitter](http://www.twitter.com/manbeardgames).  


</div>