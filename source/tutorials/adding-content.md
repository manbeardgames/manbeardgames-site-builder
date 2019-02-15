---
title: Adding Content
short: This tutorial briefly goes over adding content, such as images, sounds, and fonts, to your game.
layout: default
publish: false
index: 100
date: Feburary 14, 2019
ogtitle: Adding Content
ogimage: https://manbeardgames.com/img/ogmbg.png
ogdescription: This tutorial briefly goes over adding content, such as images, sounds, and fonts, to your game
---
<div class="container post">

# Adding Content  
---
No matter what game your making, you're going to need some content added to your game.  Content can be images such as sprite, fonts, sound effects, or music to name a few.  When using the MonoGame framework, adding content to your game is simplified with the Content Pipeline Tool.

## Why Do We Need This Tool  
---
Let's create a scenario.  You're using MonoGame to develop the next big indie sensation.  You've created some really awesome sprites to use in the game, and now you need a way to get them in the game.  You have your file *reallyCoolSprite.png* in your project folder.  You know that you have to use the SpriteBatch to draw a Texture2D object to the screen, but how do you turn your image file into a Texture2D object in code?

One way could be to use the `Texture2D.FromStream()` method.  This method takes two parameters, a *GraphicsDevice* object and a *System.IO.Stream* object of the image file. The GraphicsDevice object would be the one found in you base Game class's *GraphicsDeviceManager*.

```csharp
public class Game1 : Game
{
    //  This is the Graphics Device Manager in you Game class
    GraphicsDeviceManager graphics;
    SpriteBatch spriteBatch;

    public Game1()
    {
        graphics = new GraphicsDeviceManager(this);
        Content.RootDirectory = "Content";
    }
}
```

Ok, so now you could do something like this to load your image file in the `LoadContent` method

```csharp
//  The idle sprite of the player
Texture2D playerIdle;

protected override void LoadContent()
{
    // Create a new SpriteBatch, which can be used to draw textures.
    this.spriteBatch = new SpriteBatch(GraphicsDevice);


    //  Determine the path to the image file.
    string imageFilePath = Path.Combine(Environment.CurrentDirectory, "player_idle.png");

    //  Use a FileStream to get the stream of the image file.
    using (FileStream stream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
    {
        //  Create the playerIdle Texture2D using the file stream
        playerIdle = Texture2D.FromStream(graphics.GraphicsDevice, stream);
    }
}
```

That is all a bit cumbersome just to load in one image.  We have to create file streams whenever we want to load our images in?  We have to know the exact path to the file. Plus, the file has to be deployed with your game in a completely open format.

There's a better way...

## The Content Pipeline Tool
---
MonoGame comes with this nifty little tool called the Content Pipeline Tool.  It provides us with an easy to use interface to organize and manage the content we want to add to our game, and some easy to use classes within the framework to load the content in.  The tool also creates `.xnb` formatted version of our content files. 

The Content Pipeline Tool has importers out of the box that work with a ton of different file types.  Below are some of the basic ones.

| Type  | Description |
|---|---|
| Images | Images files such a .png, .jpb, .bmp |
| Audio | Music and sound effects like .mp3, .wav, and .ogg |
| Video | H.264 video files |
| Fonts | This is .spritefont files, which describe different properties of a font, such as family and size |

We'll discuss more in depth in another tutorial about what these importers do. For now, all you need to understand is that the Content Pipeline takes in your content files, creates an `.xnb` format of the file, which we'll use to load in our game via the **Content Manager** (more on this later).

First things first, lets open the Content Pipeline Tool so we can explore it's interface a little bit.  To open it, expand the *Content* directory in the Solution Explorer in Visual Studio. Then double click *Content.mgbc* 

![Double Click Content.mgbc](double-click-content.png)  

This will open the Content Pipeline Tool window, shown below.

![MonoGame Content Pipeline Window](pipeline-tool-window.png)

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Troubleshooting Tip:
        </span>
    </div>
    <div class="card-body">
        <p>When double clicking to open, if a text file opens in Visual Studio instead of the window shown above, this is because Visual Studio is not setup to open it with the correct application.  To fix this, right cick the *Content.mgbc* in the Solution Explorer and select <span class="bold">Open With...</span>. The scroll down and click <span class="bold">MonoGame Pipeline Tool</span>, then click the <span class="bold">Set as default</span> button, then click the <span class="bold">Ok</span> button.</p>
    </div>
</div>

Now that we have the window open, lets go over what where looking at. First thing to point out is tha there are three panels within the window. They are

| Name | Description|
|---|---|
| Project | This is where you can see the list of all content you've added so far.  You can create directories here as well to help organize your content. |
| Properties | When you select an item in the Project panel, all properties of the item that can be changed will show here. |
| Build Output | This shows the output log when the content is built.  |


You'll want to come up with some type of organization for the content you add.  So lets add a new folder call *images*.  To do this, you can right-click inside the Project panel, the select **Add**, and then **New Folder*

![Add New Folder](add-new-folder.png)

For the purposes of this tutorial, name the folder **images**. This will be the folder we place images inside of.  Now that we have our folder, lets add our image too it. Right click the newly created folder, then select **Add**, and then **Existing Item...**

![Add Existing Item](add-existing-item.png)

Use the file selector to add the image. After selecing the image, you will be shown the Add File Dialog.  

![Add File Dialog](add-file-dialog.png)

This will present you with the following three options

| Option | Description |
|---|---|
| Copy the file to the directory | Choosing this will make a copy of the original file, and place the copy inside the content directory.  **Keep in mind, choosing this option means that any changes to the original file will not be reflected in the content file, since it's a copy** |
| Add a link to the file | Choosing this will create a link to the original file for the content pipeline tool.  **Unlike choosing to copy the file, using this option, changes in the original will be reflected. However, if you move, rename, or delete the original file, the link will be broken.** |
| Skip adding the file | Choosing this option skips adding the file. When adding a single file, this is the same as clicking the cancel button.  |

For this tutorial, we are going to choose the **Copy the file to the directory** option.  Make sure this is chosen, then click **OK**.

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Explore Tip:
        </span>
    </div>
    <div class="card-body">
        <p>We're not going to cover it in this tutorial, but feel free to explore the Properties panel for the image after adding it.  Just click the image in the Project panel, then look over all the different things within the Properties panel. <span class="bold">Just be sure that if you change any values, to change them back to what they were. For the purpose of the tutorial, we'll only be using the default values</span></p>
    </div>
</div>

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Explore Tip:
        </span>
    </div>
    <div class="card-body">
        <p>Since we choose to copy the file to the directory, take a moment to explore where the file is copied too.  In you game's project folder, locate and open the <span class="bold">Content</span> folder.  In here, you'll see the <span class="italic">images</span> folder we created in the Content Pipeline Tool, and insde there will be the image we just added.  Remember, this is a <span class="italic">copy</span> of the original </p>
    </div>
</div>

Now that we have added our content, the next step is to tell the Content Pipeline tool to build the content.  To do this, click the **Build** menu item at the top of the window, then select **Build** 

![Build Content](build-content.png)

You should see some text appear in the Build Output panel while it's building.  When it finishes, it'll show that the build succeeded.  After this you can close the Content Pipeline Tool window.

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Explore Tip:
        </span>
    </div>
    <div class="card-body">
        <p>When the Content Pipeline Tool builds the content, it creates an .xnb file of the content.  These are placed in the /Content/bin/ folder inside your game's project folder </p>
    </div>
</div>

And that's it for adding content with the Content Pipeline Tool.  Next we'll go over using the `ContentManager` inside the game's code to load our content into the game to be used.

## Content Manager
The `ContentManger` is a class within your game's code that is used to manage the loading and unloading of content that we added using the Content Pipeline Tool. Using it is pretty straightforward.

You're Game class already has a propety call `Content`, which is your games instance of the ContentManager.  We can use the `Load<T>(string assetName)` method to load the our image into the game as a Texture2D object. 

In your Game class's `LoadContent()` method, add the following

```csharp
//  The idle sprite of the player
Texture2D playerIdle;

protected override void LoadContent()
{
    // Create a new SpriteBatch, which can be used to draw textures.
    this.spriteBatch = new SpriteBatch(GraphicsDevice);

    //  Load the image as a Texture2D using the ContentManager
    playerIdle = Content.Load<Texture2D>("images/player_idle");
}
```
The `Load<T>(string assetName)` method is a C# generic method, sigified by the `<T>`, which means we have to tell it what type of content it is loading, in this case a Texture2D.  Then, we have to pass in the asset name that we want to load, in this case the player_idle.png image.  Since we put it inside the *images* directory in the Content Pipeline Tool, we also need to specify this.  Note however that we do not add the extension.  This is because the ContentManger knows that it is loading the .xnb file that was generated by the Content Pipeline Tool.  

And that's it.  Now that we have our image loaded as Texture2D, we can use that with the SpriteBatch to draw it to the screen.  



</div>