# Connecting To The Shared Project
To connect **MyAwesomeGame.Desktop** to **MyAwesomeGame.Shared** is actual pretty simple. We need to add the reference to the shared project and then do some small adjustments to the Desktop project.  So lets start with adding the refrence first.

Expand **MyAwesomeGame.Desktop** in the *Solution Explorer* window if it isn't already.  Then right-click on **References** and select **Add Reference...** to open then *Reference Manager* window.  Next click **Shared Projects** on the left, and then check the box for **MyAwesomeGame.Shared**. Finally, click **Ok** to finish.

![reference manager window](tutorials/monogame-shared-project/reference-manager-window.png);

After clicking the Ok button, if you expand the References section, you should now see *MyAwesomeGame.Shared* listed as a reference for the Desktop project.

Now, since we are going to be doing all of our game logic from the Shared project, we don't need the **Game1.cs** file in our Desktop project.  Before we delete it, lets first copy it to our Shared project.  Right-click **Game1.cs** in the Desktop project and select **Copy**.  Then right-click the Shared project in the *Solution Explorer* window and select **Paste**.  Open the **Game1.cs** we just pasted in the Shared project, and change the namespace from **MyAwesomeGame.Desktop** to **MyAwesomeGame.Shared**.  Then save and close the file.

Next we need to make sure that our Desktop project calls the **Game1** class that is located in our Shared project when it runs, and not its own.  So to do this, first delete the **Game1.cs** file that is in the **MyAwesomeGame.Desktop** project.  Next, open **Program.cs**. Immediatly, it should have an error saying it cannot find *Game1*.  This is expected since we just deleted it.  Instead, we need to tell it to use the *Game1* from the Shared project.  To do this, just add `using MyAwesomeGame.Shared` to the top.  Once you've done this, **Program.cs** should look similar to the following

```csharp
using System;
//  Add reference to MyAwesomeGame.Shared so we can use the Game1 class from there
using MyAwesomeGame.Shared;

namespace MyAwesomeGame.Desktop
{
    /// <summary>
    /// The main class.
    /// </summary>
    public static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            //  This is calling Game1 from MyAwsomeGame.Shared now.
            using (var game = new Game1())
                game.Run();
        }
    }
}
```

Once you've made this change, be sure to save the file and then close it.  Now we need to test to show that this is in fact using Game1 from the Shared project.  To test this, open **Game1.cs** in the **MyAwesomeGame.Shared** project. In the constructor, find the following

```csharp
graphics.IsFullScreen = true;
```

and change it to

```csharp
graphics.IsFullScreen = false;
```
This way we can test without having to go into full screen.  Next scroll down to the `Draw` method and change the following

```csharp
GraphicsDevice.Clear(Color.CornflowerBlue); 
```

to the following

```csharp
GraphicsDevice.Clear(Color.Orange);
```

Now click the **Start** button at the top in Visual Studio to run the game. You should get a nice orange window that opens up. 

![orange game window](tutorials/monogame-shared-project/orange-game-window.png)

Close the game window and got back to the `Draw` method and just like before, change the clear color, only this time, change it to `Color.Black`.  Click **Start** again, and this time, we should get the game window, only as a black screen.

![black game window](tutorials/monogame-shared-project/black-game-window.png)

Perfect, now we know that the Desktop project is indeed using the Game1 from the Shared Project.  We've successfully connect the Desktop project to the Shared project.  Now, lets get adventureous.  