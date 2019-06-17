<div class="container post">

# Overview
---
No matter what game you're making, you're going to need some content added to your game.  Content can be images such as sprites, fonts, sound effects, or even music to name a few.  But how do you add your files to the game project, and then how do you load them up within the game's code?  When using the MonoGame framework, adding content to your game is simplified with the **Content Pipeline Tool**, and loading it within the code is done with the **ContentManager**.   

In this tutorial, we'll go over the basics of both the tool and the manager by creating a small MonoGame project and adding a player image to the game.  

# Project Files
---
If you would like to follow along with this tutorial using the same files and assets I use, you can find them [here on github](https://github.com/manbeardgames/manbeardgames-site-tutorials/tree/master/tutorials/adding-content).

# The Content Pipeline Tool and the ContentManager
---
Let's create a scenario.  You're using the MonoGame framework to develop the next big indie hit.  You've created some really awesome sprites for your character to use in the game, and now you need a way to get them in the game.  You have your file **player_idle.png** in your project folder.  You know that to draw to the game window, you use the `SpriteBatch.Draw` method, but all variations of this method require a `Texture2D` object.  How do you turn your player_idle.png file into a Texture2D object in code?  This is where the **Content Pipeline Tool** and the **ContentManager** class comes in.

The Content Pipeline Tool is a nifty little tool that comes with MonoGame.  It takes your game assets (aka content) and creates `.xnb` files that can be used by the ContentManager to load them up in your game. Why would we want to do this though; converting our game assets to this arbitrary .xnb file format. Can't we just read the image file directly into the game using things like FileStreams?  Let's explore this using the following scenario.

## Scenario: Using FileStream
---
Yes, you can use things like a `FileStream` to load your images into the game.  The **Texture2D** class has a method called `FromStream(GraphicsDevice graphicsDevice, Stream stream)`, which takes a *GraphicDevice* object and a *System.IO.Stream* object of the image file.  Let's go ahead and create a new MonoGame Cross Platform Desktop Project.  Once created, open the **Game1.cs** file.  Let's add a `Texture2D` object called **_playerIdle** that we'll use to hold our sprite.  Add it just under the SpriteBatch, so it should look like the following.

```csharp
/// <summary>
/// This is the main type for your game.
/// </summary>
public class Game1 : Game
{
    GraphicsDeviceManager graphics;
    SpriteBatch spriteBatch;

    //  This is the Textur2D that will represent our "player_idle" sprite
    Texture2D playerIdle;

    public Game1()
    {
        graphics = new GraphicsDeviceManager(this);
        Content.RootDirectory = "Content";
    }

    //....
```

Now, we need to add the player_idle.png file to our project. So go ahead and do this by right clicking the project in the Solution Explorer, selecting **Add Existing Item**, and choosing the **player_idle.png**.  Be sure to change the "Copy to Output Directory" property for the file in the properties window to "Copy Always".  Now inside the `LoadContent()` method we can use the `Texture2D.FromStream` method to load it in like so (be sure to add the `using System.IO;` using statement to the top of the Game1.cs file)

```csharp
/// <summary>
/// LoadContent will be called once per game and is the place to load
/// all of your content.
/// </summary>
protected override void LoadContent()
{
    // Create a new SpriteBatch, which can be used to draw textures.
    spriteBatch = new SpriteBatch(GraphicsDevice);

    //  We need to calculate the full path to the image file
    string pathTo = Path.Combine(System.Environment.CurrentDirectory, "player_idle.png");

    //  Use a new file stream to load the image into a Texture2D object
    using (var fileStream = new FileStream(pathTo, FileMode.Open, FileAccess.Read, FileShare.Read))
    {
        _playerIdle = Texture2D.FromStream(GraphicsDevice, fileStream);
    }
}
``` 

The `GraphicsDevice` object that we passed to the `FromStream` method is a property we get from our Game1 class inheriting from `Game`.  Now since we're not using the ContentManager to load this in, that means we have to manage the resource, which includes disposing of it whenever we need to unload content.  So, in our `UnloadContent` method, add the following

```csharp
/// <summary>
/// UnloadContent will be called once per game and is the place to unload
/// game-specific content.
/// </summary>
protected override void UnloadContent()
{
    //  Dispose of our non ContentManger content 
    if(_playerIdle != null && !_playerIdle.IsDisposed)
    {
        _playerIdle.Dispose();
    }
}
```

This is one way of loading an image file into your game as a Texture2D.  It's a bit cumbersome though, having to use file streams, managing the content unloading manually, and the fact that the image file must exist in the deployed game's files as a plain image file that anyone could open and manipulate.  Now, let's look at the process of doing this with the Content Pipeline Tool and the ContentManager.



## The Content Pipeline Tool
---
As I said before, the Content Pipeline Tool comes with MonoGame and provides a user interface for managing our game assets.  It takes our game assets, imports them, processes them, then outputs them as a `.xnb` file.  These output files are what the ContentMangaer will use to locate and load our assets.  The Content Pipeline Tool has several out-of-the-box importers to use that work with various file types.  Below is table of some of the basic ones.

| Type  | Description |
|---|---|
| Images | Images files such a **.png**, **.jpg**, **.bmp** |
| Audio | Music and sound effects like **.mp3**, **.wav**, and **.ogg** |
| Video | H.264 video files |
| Fonts | This is **.spritefont** files, which describe different properties of a font, such as family and size |

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">In Depth</span>
    </div>
    <div class="card-body">
        <p>
            While it is out-of-scope for the purposes of this tutorial, the Content Pipeline Tool is customizable in that if it doesn't have an importer/processor for a file type, you can create your own.  We'll go over this in a future tutorial, just know that the functionality exists.  For now, all you need to understand is that the Content Pipeline Tool uses an "importer" to import your file, and a "processor" which processes and outputs the file into a .xnb file.
        </p>
    </div>
</div>

So, let's just dive right into this.  First create a new MonoGame Cross Platform Desktop Project. We won't be reusing the previous one from the scenario we covered above.  Once the project is created, expand the *Content* directory in the Solution Explorer window in Visual Studio.  Then double click the **Content.mgbc** file.

![Double Click Content.mgbc](adding-content/double-click-content.png)  

This will open the Content Pipeline Tool window, shown below.

![MonoGame Content Pipeline Window](adding-content/pipeline-tool-window.png)

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Troubleshooting Tip:
        </span>
    </div>
    <div class="card-body">
        <p>When double clicking to open, if a text file opens in Visual Studio instead of the window shown above, this is because Visual Studio is not setup to open it with the correct application.  To fix this, right click the <span class="font-weight-bold">Content.mgbc</span> in the Solution Explorer and select <span class="font-weight-bold">Open With...</span>. The scroll down and click <span class="font-weight-bold">MonoGame Pipeline Tool</span>, then click the <span class="font-weight-bold">Set as default</span> button, then click the <span class="font-weight-bold">Ok</span> button.</p>
    </div>
</div>

Now that we have the window open, lets go over what where looking at. First thing to point out is that there are three panels within the window. They are

| Name | Description|
|---|---|
| Project | This is where you can see the list of all content you've added so far.  You can create directories here as well to help organize your content. |
| Properties | When you select an item in the Project panel, all properties of the item that can be changed will show here. |
| Build Output | This shows the output log when the content is built.  |


You'll want to come up with some type of organization for the content you add.  Let's add a new folder call *images*.  To do this, you can right-click inside the Project panel, the select **Add**, and then **New Folder**

![Add New Folder](adding-content/add-new-folder.png)

Let's name the folder **images**. This will be the folder we place our player_idle.png image inside of.  Now that we have the folder, lets add our image too it. Right click the newly created folder, then select **Add**, and then **Existing Item...**

![Add Existing Item](adding-content/add-existing-item.png)

Use the file selector to add the image. After selecting the image, you will be shown the Add File Dialog.  

![Add File Dialog](adding-content/add-file-dialog.png)

This will present you with the following three options

| Option | Description |
|---|---|
| Copy the file to the directory | Choosing this will make a copy of the original file and place the copy inside the content directory.  **Keep in mind, choosing this option means that any changes to the original file will not be reflected in the content file, since it's a copy** |
| Add a link to the file | Choosing this will create a link to the original file for the content pipeline tool.  **Unlike choosing to copy the file, using this option, changes in the original will be reflected. However, if you move, rename, or delete the original file, the link will be broken.** |
| Skip adding the file | Choosing this option skips adding the file. When adding a single file, this is the same as clicking the cancel button.  |

For this tutorial, we are going to choose the **Copy the file to the directory** option.  Make sure this is chosen, then click **OK**.

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Let's Explore
        </span>
    </div>
    <div class="card-body">
        <p>
            We're not going to cover it in this tutorial, but feel free to explore the Properties panel for the image after adding it.  Just click the image in the Project panel, then look over all the different things within the Properties panel. <span class="bold">Just be sure that if you change any values, to change them back to what they were. For the tutorial, we'll only be using the default values</span>
        </p>
    </div>
</div>

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Let's Explore
        </span>
    </div>
    <div class="card-body">
        <p>
            Since we choose to copy the file to the directory, take a moment to explore where the file is copied too.  In you game's project folder, locate and open the <span class="bold">Content</span> folder.  In here, you'll see the <span class="italic">images</span> folder we created in the Content Pipeline Tool, and inside there will be the image we just added.  Remember, this is a <span class="italic">copy</span> of the original 
        </p>
    </div>
</div>

Now that we have added our content, the next step is to tell the Content Pipeline tool to build the content.  To do this, click the **Build** menu item at the top of the window, then select **Build** 

![Build Content](adding-content/build-content.png)

You should see some text appear in the Build Output panel while it's building.  When it finishes, it'll show that the build succeeded.  After this you can close the Content Pipeline Tool window.

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Let's Explore
        </span>
    </div>
    <div class="card-body">
        <p>When the Content Pipeline Tool builds the content, it creates an .xnb file of the content.  These are placed in the /Content/bin/ folder inside your game's project folder </p>
    </div>
</div>

And that's it for adding content with the Content Pipeline Tool.  This is the process you'll use to add any game assets for your game.  Next, we'll go over using the `ContentManager` inside the game's code to load our content into the game to be used.

## Content Manager
---
The `ContentManger` is a class within your game's code that is used to manage the loading and unloading of content that we added using the Content Pipeline Tool. Using it is pretty straightforward.  In Visual Studio, open the *Game1.cs* file.  As we did before, add a `Texture2D` called **_playerIdle**.

```csharp
/// <summary>
/// This is the main type for your game.
/// </summary>
public class Game1 : Game
{
    GraphicsDeviceManager graphics;
    SpriteBatch spriteBatch;

    //  This is the Textur2D that will represent our "player_idle" sprite
    Texture2D playerIdle;

    public Game1()
    {
        graphics = new GraphicsDeviceManager(this);
        Content.RootDirectory = "Content";
    }

    //....
```

Your `Game1` class already has a ContentManger object property called `Content` which it gets from the inheritance of the Game class. We can use the `Load<T>(string assetName)` method to load the our image into the game as a `Texture2D` object. 

Scroll down to the `LoadContent()` method and add the following

```csharp
/// <summary>
/// LoadContent will be called once per game and is the place to load
/// all of your content.
/// </summary>
protected override void LoadContent()
{
    // Create a new SpriteBatch, which can be used to draw textures.
    spriteBatch = new SpriteBatch(GraphicsDevice);

    //  Use the ContentManger to load our player_idle sprite as a Texture2D object
    _playerIdle = Content.Load<Texture2D>("images/player_idle");
}
```

The `Load<T>(string assetName)` method is a C# generic method, signified by the `<T>`, which means we have to tell it what type of content it is loading, in this case a `Texture2D`.  Then, we have to pass in the asset name that we want to load, in this case the player_idle.png image.  Since we put it inside the **images** directory in the Content Pipeline Tool, we also need to specify this.  Note however that we do not add the extension.  This is because the ContentManger knows that it is loading the .xnb file that was generated by the Content Pipeline Tool.  

And that's it.  Now that we have our image loaded as Texture2D, we can use that with the SpriteBatch to draw it to the screen.

# Conclusion
There is more than one way to import game assets into your game, load them up, and use them.  For most of the out-of-the-box content types such as `Texture2D`, `SoundEffect`, and `Song`, these classes offer a `.FromStream` (or `FromUri` for `Song`) method to load the content without the use of the Content Pipeline Tool and ContentManager.  This means that you'll have to manually manage the resource and unloading it should it need to be disposed of.  MonoGame however offers the Content Pipeline Tool and the ContentManager class to simplify this process and to also help protect your files by converting them to a .xnb format.  
</div>