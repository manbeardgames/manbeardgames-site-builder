# Connect Android Project To Shared Project
Connecting the Android project to the Shared project is almost identicial to how we did it for the Desktop project.  First, we need to add the reference to the Shared Project.

Just like before, right-click **References** in the *Solution Explorer* for the Android project and select **Add Reference...**. In the *Reference Manager* window, click **Shared Projects** on the left, then check the box for **MyAwesomeGame.Shared**, and finally click the **Ok** button

![add reference](tutorials/monogame-shared-project/android-add-reference.png)

Now that we have the reference, we need to make sure that the **Game1.cs** from the Shared project is the one being loaded for the Android project.  Before we do this though, lets open **Game1.cs** in the Android project really quick and take a look at something.  In the constructor for Game1, we see a few extra properties being set for `PreferredBackBufferWidth` and `PreferredBackBufferHeight` as well as `SupportedOrientations`.  These properties are important things for us to set for an Android game, so we need to make sure they are included in the **Game1.cs** file in the Shared project as well.

But how are we going to use those settings for the android project, but have different settings for our Desktop project. Obviously, we might not want to limit our Desktop project to the same width and height resolution as our Android project.  This is where the `#if` preprocessor directive I mentioned before comes into play.  Using this lets us defined code that will only be compiled for a project *if* the symbol we check for exists. 

So how do we know which symbols to use in the `#if` statement?  Easy, these are already setup for your when you created the projects using the MonoGame templates.  To check what they are for each project, just right-click the project in the *Solution Explorer* window and select **Properties**.  Then click the **Build** option on the left side and look at the defined symbol at the top.  For exmaple, the image below shows the defined symbol for the Android project.

![android symbol](tutorials/monogame-shared-project/android-symbol.png)

If you check the symbol for the Desktop project you can see that it is actually **LINUX**.  This is the symbol used by the **MonoGame Cross Platform Desktop Project** template.  

![desktop symbol](tutorials/monogame-shared-project/desktop-symbol.png)

So now that we know this information, close any property windows or files that you might have open at the moment in Visual Studio, and then open the **Game1.cs** file that is located in the **MyAwesomeGame.Shared** project.  Find the constructor method and change it so it looks like the following

```csharp
        public Game1()
        {
            graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";
            graphics.IsFullScreen = false;

#if ANDROID
            graphics.IsFullScreen = true;
            graphics.PreferredBackBufferWidth = 800;
            graphics.PreferredBackBufferHeight = 480;
            graphics.SupportedOrientations = DisplayOrientation.LandscapeLeft | DisplayOrientation.LandscapeRight;
#elif LINUX
            graphics.PreferredBackBufferWidth = 1280;
            graphics.PreferredBackBufferHeight = 720;
            graphics.IsFullScreen = false;
#endif
        }
```

Once you've made the change, be sure to save the file.

So let's discuss really quickly what this does.  By using the `#if ANDROID` directive, when the **MyAwesomeGame.Android** project is built, it will pass along the **ANDROID** symbol that we saw in it's properties.  Since this is the symbol set, only the code for the ANDROID section will be compiled, and the LINUX seciton will be skipped compeltely.  Next, when the **MyAwesomeGame.Desktop** project is built, it will pass along the **LINUX** symbol. Just like how the ANDROID symbol worked, the LINUX symbol will only compile the code in the LINUX section.

Okay, now that we have the Game1.cs in the **Shared** project setup, we can delete the Game1.cs in the **Android** project, just like we did in the Desktop project.  So go ahead and delete that.  Then, similar to what we had to do in the Desktop project, for the **Android** project, open the **Activity1.cs** file and add the following using statement to the top

```csharp
using MyAwesomeGame.Shared;
```

Now, the Android project is using the Game1 class from the Shared project just like the desktop project.

If you have an android device, you build and run the game directly on your device.  Pretty cool huh?  If you don't know how to do this, it's pretty simple.  First, you need to make sure you have the **Developer Options** enabled on your android device.  To do this, on the android device, go to **Settings > About Phone > Software Information**, then find the **Build Number** and tap it 7 times.  This will unlock the **Developer Options** for you in the Settings.  

On the Android device, open **Settings > Developer Options**, the scroll down to **USB debugging** and enable it.  Now that you have this enabled, just connect the Android device to your PC via the USB cable.  Once you do, you should get a pop up on your phone asking for permission for USB debugging for your computer.  Click **Allow**.

Finally, in Visual Studio, right-click **MyAwesomeGame.Android** in the *Solution Explorer* window, and choose **Set as StartUp Project**.  Alternativly, you can change the startup project via the dropdown at the top of Visual Studio.  Once you do this, the **Start** button in Visual Studio will change to show your Android Device like below.

![start android](tutorials/monogame-shared-project/start-android.png)

Click this, and Visual Studio will build the apk and push it to your phone, install it, and automatically launch it on your phone for you. Pretty sweet huh?

