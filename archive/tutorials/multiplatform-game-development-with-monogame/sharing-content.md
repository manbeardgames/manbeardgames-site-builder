# Sharing Content
So now we have our Android project and Desktop project both using the same code base from our Shared project.  The only riddle left to solve is, how do we get them to share the content added using the Content Pipeline Tool. Solving this would allow us to also have a central base for the content instead of having to add all of the content into each project's *Content.mgcb* file.

First, we need to add one final project to our solution.  We're going to add a **MonoGame Windows Project**.  So, just like we've done before, right-click the solution in the *Solution Explorer* window and select **Add > New Project...**.  Click **MonoGame** on the left under *Visual C#*, then select the **MonoGame Windows Project** template.  Name this one **MyAwesomeGame.Content**, click **Browse** and choose the our folder, then click **Ok**.

![add content project](tutorials/monogame-shared-project/add-content-project.png)


Once you have created the project, in the *Solution Explorer* window, delete everything EXCEPT for the **Content** directory. Once you do this, your **MyAwesomeGame.Content** project should only contain the **Content** directory with the **Content.mgcb** file inside it like below

![content only](tutorials/monogame-shared-project/content-only.png)

Next, in the *Solution Explorer* window, locate the **Content.mgcb** file for the **MyAwesomeGame.Desktop** project and delete it. Then, still in teh **MyAwesomeGame.Desktop** project, right-click the *Content* directory and select **Add > Existing Item...**.  Navigate to the root directory that contains all of the projects, the one that we setup at the very beginning of this tutorial.  In this directory, open the **MyAwesomeGame.Content** directory, then open the **Content** directory inside of it.  In the bottom right of the window, change the file type from **Visual C# files** to **All Files**. When you do this, you should now see the **Content.mgcb** file.  Single click the file, do not double click. Finally, click the down arrow that is beside the **Add** button in the bottom right, and select **Add As Link...**

![add as link](tutorials/monogame-shared-project/add-as-link.png)

Once you do this, you should now see the **Content.mgcb** file located in the *Content* directory again for the **MyAwesomeGame.Desktop** project in the *Solution Explorer* window.  Only the icon for it looks a tad different. It now has a small square with a small arrow in it at the bottom right of its icon. This is to let you know that this file is actually a link to the file located somewhere else, in this case to the *Content.mgcb* file from the *MyAwesomeGame.Content* project.

One last thing we need to do now for the **Content.mgcb** we just added to the Desktop project is to change its build action.  To do this, click the **Content.mgcb** file in the Desktop project, then in the *Properties* window, for **Build Action** change it to **MonoGameContentReference**.

![monogame content reference](tutorials/monogame-shared-project/monogame-content-reference.png)

Now, perform the same steps we just did, deleting the Content.mgcb file then adding it back as as link, but do it this time for the **MyAwesomeGame.Android** project instead.

Once you've done that, lets add some content.  Open the **Content.mgcb** file from either the Android, Desktop, or Content project.  It doesn't matter which, they will all open the same single one from the Content project. In the *MonoGame Pipeline Tool* window that opens, add a new **SpriteFont Description** item called **game_font**.

![add font](tutorials/monogame-shared-project/add-font.png)

Once you've added it, click the save button, then close the window.

Next open **Game1.cs** in the Shared project. At the top, find where the GraphicsDeviceManager and SpriteBatch fields are created. 
Add the following field under the SpriteBatch one.

```csharp
SpriteFont font;
```

Next, scroll down to the `LoadContent` method and change it to the following so we load in our game font.

```csharp
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);

            // Load the game font
            font = Content.Load<SpriteFont>("game_font");
        }
```

Finally, scroll down to the `Draw` method and change it to the following

```csharp
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Black);

            spriteBatch.Begin();

#if ANDROID
            spriteBatch.DrawString(font, "Hello from the Android Project", new Vector2(100, 100), Color.White);
#elif LINUX
            spriteBatch.DrawString(font, "Hello from the Desktop Project", new Vector2(100, 100), Color.White);
#endif

            spriteBatch.End();
            base.Draw(gameTime);
        }
```

Once again, we're going to make use of the `#if` preprocessor directive.  This is so we can display a seperate message on the screen depending on if its the Android project or the Desktop project that is running.

Now, right-click the **MyAwesomeGame.Desktop** project in the *Solution Explorer* window and choose **Set as StartUp Project**. Then click the **Start** button at the top of Visual Studio.  Once the game builds and launches, you should see the following

![desktop-project-final](tutorials/monogame-shared-project/desktop-project-final.png)

If you have an android device to test with, perform the steps we did earlier in when setting up the Android project and test the game on your device.  You should see the same game, only with the message stating *Hello from the Android Project* instead.