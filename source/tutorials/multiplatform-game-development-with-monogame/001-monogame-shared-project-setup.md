# Multiplatform Game Development With MonoGame
One of the amazing things you can do with MonoGame is develope and write your code in one place and then build it for multiple platforms.  This includes Windows (DirectX), Windows, Mac, and Linux (OpenGL), Android devices, IOS devices, Playstation 4, Xbox One, and Nintendo Switch to name a few. Developing for multiple platforms however can seem like a daunting task to setup.  How do you manage your code base? Do you have separate projects for each platform? If so, would you have to copy/paste code between the projects to ensure they are all in sync with each other?

Well, that's one way to do it, though I wouldn't suggest going that route.  Attempting to manage the same code base duplicated across multiple projects can be a nightmare, lead to fragmented code, and becomes almost impossible to maintain.

Instead, a more thought out approach to developing for multiple platforms would be to have one project where all of your game logic lives.  Then this one project is referenced by each individual project type for the platforms you want to support. These individual projects at this point basically act as a launcher for the game for their respective platforms.  Once past the launching point, they are all utilizing the same exact single project that your game logic was developed in.

Doing this approach isn't new to application or game development, though it may be one you're unfamiliar with or didn't know you could do.  Like anything else when dealing with code development, there are multiple ways to achieving this goal.

In this tutorial, I'm going to layout three separate methods for achieving this.  In the first method, we'll take a look at using a **Class Library** project with the **Monogame Framework PCL**.  In this approach, the the code we develop will create a **.dll** that is then referenced by each of our platform specific project types. Next, we'll look at setting up a **C# Shared Project** that is referenced by each of our platform project types.  In this method, instead of a .dll being built that is referenced by our projects, each project compiles the shared projects code with itself.  The last method we'll look will use the **MonoGame Shared Project** template that is provided by MonoGame when you install it.  This one will work almost identically to the C# Shared Project method, with the difference being how we manage content for our game between the projects.

## Prerequisites
If you want to follow along with this tutorial on your own computer, the following is a list of things you'll need to ensure you have installed first. Doing so will ensure that you have the necessary software to complete the tutorial.  If however you'd rather just read the tutorial to understand the concepts, you can skip over this prerequisite section.

* Windows PC - This tutorial will assume a Windows PC for development. All screenshots and instructions referenced will be done from a Windows PC perspective, specifically Windows 10.  The concepts however will be universal for development on other operating systems.
* Visual Studio 2017 - We'll be using Visual Studio 2017 Community Edition for this tutorial.  At the time of this writing Visual Studio 2019 has released, however there is no official MonoGame installer that supports it yet. 
* MonoGame 3.7.1 - We'll be working with the templates that are installed as part of the MonoGame version 3.7.1 installation. As of the time of this writing, that is the most current version released.
* Android Device - This tutorial is all about multiplatform development, and what would that be without multiple platforms.  However, not everyone has an android device, I understand this, so the tutorial will accommodate for this. **If you do not have an android device, feel free to skip any sections that reference the android project.**

## Tutorial Files
Everything created during this tutorial is available as a complete final project for you to reference.  These files are available for download in the multiplatform-game-development-with-monogame repository on GitHub.  You can use the following git command to clone the repository

```
git clone http://path/to/repository
```

## Conventions Used In This Tutorial
Throughout this tutorial, there will be a few conventions used to assist in reading code clearly and provide helpful insights along the way.  All code will be presented in this tutorial in code blocks that look like the following

```csharp
//  This is an example of a code block use throughout this tutorial
string _myString;

public void MyMethod()
{
    //  This method does nothing
}
```

All code written will follow the coding guidelines outline here https://github.com/dotnet/corefx/blob/master/Documentation/coding-guidelines/coding-style.md  (yes GhostGoatsGames, this means brackets on a new line).

Also, throughout the tutorial will be sections that will provide additional notes and insights.  These are not required, they are just additional information provided to you the reader to extend the information being given. These will look like the following

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">Note:</span>
    </div>
    <div class="card-body">
        <p>
            This is an example of a section provided throughout the tutorial that will contain additional information to expand on what is already being taught.  This information is optional and can be skipped over, but we're here to learn right?  Learn all the things, read all the notes.
        </p>
    </div>
</div>

## Acknowledgements
I know, get on with the tutorial right? Before we do that, I want to take a moment to make some acknowledgements.  First, I'd like thank the Game Dev's Quest community.  Without a community as supportive as it, I would have lost motivation long ago to continue with game development.  With that, I'd also like to extend a thank you to Taylor and Rhett who started the Game Dev's Quest community.  

I'd also like to thank the MonoGame team.  The MonoGame framework is a joy to develop with.

And finally, I'd like to thank you, the reader. I sincerely hope that I'm able to impart some knowledge of mine to you in this tutorial.  

Now, with all of that out of the way, let's get on with the show.

# Method 1: The Class Library Approach
In this section, we're going to setup our game development solution using a **Class Library** as the central project for all of our game code.  When a class library project is compiled, it produces a dynamic link library, or **dll**, file.  This dll will contain all of the code necessary for our game.  Then, each of the platform specific projects will reference this dll file to launch our game specific to how that platform needs to call it to launch. This is aligned with the goal of this tutorial by providing one project to develop all game logic in with individual platform specific projects to run the game code.

## Create The Solution
A solution (.sln) file is a structured file used by Visual Studio to organize the projects that we create within Visual Studio.  Since we are going to be adding multiple projects types to our overall project, we'll first need to create an empty solution.

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">Create An Empty Solution?</span>
    </div>
    <div class="card-body">
        <p>
            Typically, when creating a new project in Visual Studio, a solution file is automatically create for you and placed in the same directory as the project.  We could take advantage of this for the tutorial, however since we are going to be working with multiple projects, I think it would be a good idea to show creating one manually first.
        </p>
    </div>
</div>

To start, we need to create a directory on our computer that we can store our solution file  and all of the associated projects in. For the purpose of this tutorial, create a new folder on your desktop called **class-library-example**.

Next, launch Visual Studio if you don't already have it open.  On the top menu click **File > New > Project**.  This will open the *New Project* window.  At the top right of this window is a search box. Click this and enter **Blank Solution** for your search.  Select the **Blank Solution** item (it should be the only one listed).  

![search-and-select-blank-solution.png](tutorials/multiplatform-game-development-with-monogame/search-and-select-blank-solution.png)

At the bottom of the *New Project* window, we need to give our solution a name.  Let's call it **MyAwesomeGame**.  After entering the name, click the *Browse* button and navigate to and select the **class-library-example** directory that we created previously. Also, for the purpose of what we're doing, be sure the **Create directory for solution** is unchecked. When finished, click the *Ok* button.

![give-solution-a-name.png](tutorials/multiplatform-game-development-with-monogame/give-solution-a-name.png)

Once you click the Ok button, Visual Studio will create the new solution file and open it up.  If you look in the *Solution Explorer* panel in Visual Studio, you should see *Solution: 'MyAwesomeGame' (0 Projects)* listed.

![solution-explorer-solution-only.png](tutorials/multiplatform-game-development-with-monogame/solution-explorer-solution-only.png)

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">Solution Explorer</span>
    </div>
    <div class="card-body">
        <p>
            The solution explorer window gives us a hierarchial view of our solution, the projects, and all files associated with them.  If you do not have the <i>Solution Explorer</i> window visible for you, you may have closed it accidentally previously.  To reopen it, at the top of Visual Studio click <b>View > Solution Explorer</b>.
        </p>
    </div>
</div>

## Add A Class Library Project
Now that we have our solution created, lets go ahead and create the **Class Library** project that will be used as the central code base. To do this, first right-click the solution in the *Solution Explorer* window and select **Add > New Project...**. This opens the *New Project* window for us again.

In the *New Project* window, click **Visual C#** on the left side of the window to display all of the Visual C# project types.  Next, find an locate the **Class Library (.NET Framework)** item and select it.  

![select-class-library.png](tutorials/multiplatform-game-development-with-monogame/select-class-library.png)

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">What are there multiple Class Library items listed</span>
    </div>
    <div class="card-body">
        <p>
            You may have noticed that in the list, there are  <b>.NET Framework</b>, <b>.NET Standard</b>, and <b>Legacy Portable</b> Class Library items.  Each of these is for the different .NET platform developing you are developing for. Since MonoGame uses .NET Framework, this is the on we'll be choosing.
        </p>
    </div>
</div>

Next, just as we did with the solution, we need to give our class library project a name at the bottom.  Let's call it **MyAwesomeGame.Shared**.  Appending the name with *.Shared* serves two purposes. First, it allows us to visually identify this project as the one that will be shared with the others.  Second, Visual Studio will automatically generate the *MyAwesomeGame.Shared* namespace for us when we create new code files.  This helps when referencing this code in the other platform specific projects.  

You may also need to click the *Browse* button and navigate to and select the **class-library-example** directory that we created, if this is not already the directory selected.  Finally, for the purposes of this tutorial, click the *Frameworks* dropdown and select the **.NET 4.5** option.  When finished, click the *Ok* button to create the project.

![give-class-library-a-name.png](tutorials/multiplatform-game-development-with-monogame/give-class-library-a-name.png)

Once you click Ok, Visual Studio will create the class library project for you. If you look in the *Solution Explorer* panel, you can see the new project, and that it already has one code file called **Class1.cs**.  We don't need this file, so go ahead and delete it.

Now we need to do one last thing for now to our class library project.  We want to develop all of our game code here, but this class library project has no idea what the MonoGame Framework is and how to reference it.  So we need to add the reference in.  Thankfully, we can do this through the use of a NuGet package provided by the MonoGame team. 

To do this, right-click on the *MyAwesomeGame.Shared* project in the *Solution Explorer* window and select **Manage NuGet packages...**.  This will open the *NuGet Package Manager* window for us in Visual Studio.  Click the **Browse** link at the top of the window, then, in the search bar below it type **MonoGame.Framework.Portable**.  Select the **MonoGame.Framework.Portable** item in the list of results that is by the **MonoGame Team**, then to the right of it, click the *Install* button.

add-monogame-pcl-package.png
![add-monogame-pcl-package.png](tutorials/multiplatform-game-development-with-monogame/add-monogame-pcl-package.png)

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">Which version of the package to install</span>
    </div>
    <div class="card-body">
        <p>
            When choosing to install a NuGet package, there is a dropdown beside the install button where you can choose which version of the package to install. It's generally best to always select the one listed as the <i>Latest Stable</i> version, unless you have a specific reason to use a previous version. For the <b>MonoGame.Framework.Portable</b> package, as of the time of writing the tutorial, the latest stable version listed is 3.7.1.189
        </p>
    </div>
</div>

After clicking the Install button, you'll receive a pop up to preview what is being installed.  When finished reviewing it, click the *Ok* button.  Once you click OK, the MonoGame.Framework.Portable package will be downloaded and installed into your project.  If you expand the *References* for the project in the *Solution Explorer* panel, you'll see that you now have **MonoGame.Framework** added, along with a few others that are needed by the framework.  You can close the *NugGt Package Manager* window.

And that's it for now for the class library project.  Now lets start adding in the platform specific projects that are going to be referencing it.

## Add A MonoGame Cross Platform Desktop Project
The first platform specific project type we're going to add is the **MonoGame Cross Platform Desktop Project**.  Now, I know what your thinking, "Couldn't I just have used this one project type, since it's name contains **Cross Platform**?".  Well, no.  See, this project does support different operating systems, namely Windows, Mac, and Linux, using OpenGL as its graphics library.  However those are operating systems, and the platform, for purposes of definition for this tutorial, would be Desktop.

To add this project, right-click the solution in the *Solution Explorer* panel and select **Add > New Project...**, opening the *New Project* window.  Select **MonoGame** on the left under *Visual C#*, then select the **MonoGame Cross Platform Desktop Project** item.

![select-monogame-cross-platform.png](tutorials/multiplatform-game-development-with-monogame/select-monogame-cross-platform.png)

Now we need to give this project a name at the bottom.  Let's call it **MyAwesomeGame.OpenGL**.  We'll use *.OpenGL* appended to the name because while this project supports Windows, Mac, and Linux, the one thing they all have in common within this project is that OpenGL is used for teh graphics library.  Be sure to click the *Browse* button and navigate to and select the **class-library-example** directory we created.  When finished, click the *Ok* button.

![give-cross-platform-name.png](tutorials/multiplatform-game-development-with-monogame/give-cross-platform-name.png)

Once you click the Ok button, Visual Studio will generate the project for you based on the MonoGame Cross Platform Desktop Project template. You can see the project and all of the generated files in the *Solution Explorer* panel.  Find the **Program.cs** file that was generated and open it. 

The **Program.cs** file contains the `static void Main` method, which is the starting point when your game is run.  On line 16 and 17, you see the following code

```csharp
            using (var game = new Game1())
                game.Run();
```

The `using` statement creates a new instance of the `Game1` class, then calls the `Run` method.  This is how this specific platform project launches your game.  We need to adjust this so instead it is calling the `Game1` class from the Shared project, this way it's using the one central shared code base.

To do this, first locate the **Game1.cs** file in the *Solution Explorer* panel and right-click it, then select **Copy**. Then right-click the *MyAwesomeGame.Shared* project in the *Solution Explorer* panel and select **Paste**.  This creates a copy of Game1.cs for us in our Shared project.  Since we have it in our shared project, we don't need it anymore in the *MyAwesomeGame.OpenGL* project.  Find the **Game1.cs** in the **MyAwesomeGame.OpenGl** project in the *Solution Explorer* window, right-click it and select **Delete** to delete it.

Now we need to make some small adjustments.  Open the *Game1.cs* file in the **MyAwesomeGame.Shared** project. On line 5, you see the `namespce` declaration, which shows

```csharp
namespace MyAwesomeGame.OpenGL
```

Change this to

```csharp
namespace MyAwesomeGame.Shared
```

It had the *.OpenGL* namespace because we simply just copied the file over. Changing it will ensure it has the correct namespace within our Shared project.

Next, if you don't still have it open, locate **Program.cs** under **MyAwesomeGame.OpenGL** project in the *Solution Explorer* panel and open it.  You should see immediately that it now has an error on line 16 when it calls `new Game1()`.  This is because we deleted the Game1 for this project, so right now it has no idea what Game1 is, or for that matter, where to locate it.  So we need to show it where to locate it.  To do this, we need to add a reference to the Shared project.  

Find **References** under **MyAwesomeGame.OpenGL** in the *Solution Explorer* window, right-click it and select **Add Reference...**.  This will open the *Reference Manager* window.  Click **Projects** in the list on the left, then check the box for **MyAwesomeGame.Shared** in the middle.  Finally, click the *Ok* button when finished.

![add-class-library-reference.png](tutorials/multiplatform-game-development-with-monogame/add-class-library-reference.png)

Once you click the Ok button, you should now see **MyAwesomeGame.Shared** listed under the references for the project.

Next, in the **Program.cs** file, only line 2, add the following

```csharp
using MyAwesomeGame.Shared;
```

Now, the call to `new Game1()` on line 16 will no longer have an error. We've add the reference to our Shared project and the using statement at the top, so it now knows what and where the Game1 class is. Save and close the Program.cs file.

Now, lets make sure this is working the way we intend it to.  Open the **Game1.cs** file under our Shared project.  Find the constructor, which should start on line 15.  We're going to edit it to make the game launch in a window instead of full screen.  Change it to look like the following


```csharp
public Game1()
{
    graphics = new GraphicsDeviceManager(this);
    Content.RootDirectory = "Content";
    //  Do not launch in full screen
    graphics.IsFullScreen = false;
}
```

Now, if we click the **Start** button at the top, our game should launch in a window with a nice cornflower blue background.  It should, but it won't.  This is because currently our Shared project is set as the "StartUp project". This means when we click Start at the top, it starts whatever our StartUp project is. Class Library projects cannot be started directly.  To fix this, first close the error message. Then right-click **MyAwesomeGame.OpenGL** in the *Solution Explorer* panel and select **Set as StartUp Project**.  Now, when you click the Start button at the top, as expected, the game launches to the perfect little cornflower blue window.

We have successfully now added a new platform project and connected it to our central shared project that contains our game logic.  So what's next?  Well...lets add another platform specific project shall we?

## Add A MonoGame Android Project
We want our game to be truly multiplatform. And what is more multiplatform than also supporting mobile devices like Android.  So lets add a MonoGame Android Project.  

First, right-click the solution in the *Solution Explorer* window and select **Add > New Project...** to open the *New Project* window.  Click **MonoGame** on the left under *Visual C#*, then select the **MonoGame Android Project** item.


![select-monogame-android.png](tutorials/multiplatform-game-development-with-monogame/select-monogame-android.png)

Then, just like before, we need to give the project a name at the bottom. Let's call this one **MyAwesomeGame.Android**, since it's for Android.  Be sure to click the *Browse* button and choose the **class-library-example** directory that we created earlier. When finished, click the *Ok* button

![give-android-name.png](tutorials/multiplatform-game-development-with-monogame/give-android-name.png)

Now, when creating a new MonoGame Android project, there are a couple of things we have to configure. The first is that we need to add an AndroidManifest file.  What this file is is beyond the scope of this tutorial, however we still have to add it.  To do this, right-click the **MyAwesomeGame.Android** project in the *Solution Explorer* window and select **Properties** to open the *Properties* window.  Locate **Android Manifest** on the left, then click the **No AndroidManifest.xml found.  Click to add one.** link to generate it. 

![add-androd-manifest.png](tutorials/multiplatform-game-development-with-monogame/add-androd-manifest.png)

Once it finishes, you will receive a *File Modification Detected* notification pop up. This is normal, just click the **Reload All** button.  Once this is finished, click the save button at the top of Visual Studio, then close the properties window.

Next, we need to open the **Activey1.cs** file located under **MyAwesomeGame.Android** project in the *Solution Explorer* window. Immediately, you should see that there is an error on line 13.  This is is because the code added when the project is generated is out of date, so lets fix it really quick.  Change line 13 to the following (note that you need to include the , at the beginning)

```csharp
, LaunchMode = LaunchMode.SingleInstance
```

That takes care of the quick things we need to do, now let's hook up our Android project so that it's using the Shared project just like our OpenGl project.  First, locate **Game1.cs** under **MyAwesomeGame.Android** in the *Solution Explorer* window and open it.  While this is largely identical to the Game1 class file that was generated by our OpenGl project, there is a small difference.  Notice that starting on line 20 in the constructor, there are various properties being set for the graphics object. 

These are important things to set for our android project so we need to ensure we are still setting them in our shared project.  So close the Game1.cs file, and then locate the **Game1.cs** file under the **MyAwesomeGame.Shared** project.  In here you'll notice that on line 19 in the constructor we already are setting the IsFullScreen property, but we are setting it to `false`.  For Android, we need to set it to `true`.  So how do we resolve this.

In the Class Library approach we are using, we need to have a way of defining which platform is calling the Game1 class.  The simplest solution to this is to use an enum. Find the **MyAwesomeGame.Shared** project in the *Solution Explorer* panel, right-click it and select **Add > New Item** to open the *New Item* window.  Click **Visual C#** in the list on the left, then scroll down and locate the **Code File** item and select it.  Next, give it a name at the bottom, lets call it **Platforms**.  When finished click the *Ok* button to create the file.

add-code-file.png
![add-code-file.png](tutorials/multiplatform-game-development-with-monogame/add-code-file.png)

Add the following code to the file we just created

```csharp
namespace MyAwesomeGame.Shared
{
    public enum Platforms
    {
        Android,
        OpenGL
    }
}
```

When finished save and close the file. Next, open locate and open **Game1.cs** under **MyAwesomeGame.Shared** in the *Solution Explorer* panel.  Create a new line after line 13 where the SpriteBatch object is declared and type the following on line 14

```csharp
public static Platforms Platform;
```

Next, find the constructor method for Game1 starting on line 16 and change it so it now accepts a `Platforms` enum as a parameter and then sets the `Platform` static field we just created.  Let's also add in the logic we need to separate the graphics properties that are set depending on which platform is called. The method should now look like this

```csharp
        public Game1(Platforms platform)
        {
            Platform = platform;
            graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";

            if (Platform == Platforms.Android)
            {
                graphics.IsFullScreen = true;
                graphics.PreferredBackBufferWidth = 800;
                graphics.PreferredBackBufferHeight = 480;
                graphics.SupportedOrientations = DisplayOrientation.LandscapeLeft | DisplayOrientation.LandscapeRight;
            }
            else if (Platform == Platforms.OpenGL)
            {
                graphics.IsFullScreen = false;
                graphics.PreferredBackBufferWidth = 1280;
                graphics.PreferredBackBufferHeight = 720;
            }
        }
```

What we are doing here is requiring that when creating a new Game1 instance, a Platform enum value must be passed to it. We save this value in a static field called Platform, which we can then reference throughout our project anytime we need to separate our logic based on specific platforms.  We then do this when setting the graphics properties.

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">What About Preprocessor Directives</span>
    </div>
    <div class="card-body">
        <p>
            In this approach, we are using an enum value to differentiate between our platforms.  Later in this tutorial when we discuss the other two approaches, we'll instead use something called a preprocessor directive.  These cannot be used here however because the class library is complied down to a dll separate from the actual platform specific projects.
        </p>
    </div>
</div>

When finished, be sure to save the file and close it.


So now that we have our shared Game1 class file setup for both projects, located the **Game1.cs** file under **MyAwesomeGame.Android** and delete it, just like we did before.  Next, if it is not already open, open the **Activity1.cs** file under the **MyAwesomeGame.Android** project. You'll notice that just like with the OpenGL project, we now have an error, on line 21, because it doesn't know what or where Game1 is. So lets fix this.

Locate **References** under **MyAwesomeGame.Android** in the *Solution Explorer* panel, right-click it select **Add Reference...** to open the *Reference Manager* window.  Then just like before, click **Projects** on the left and check the box for **MyAwesomeGame.Shared**.  Finally click Ok to close the *Reference Manager* window and add the reference. 

![add-class-library-reference-for-android.png](tutorials/multiplatform-game-development-with-monogame/add-class-library-reference-for-android.png)

Next, in the Activity1.cs file, at the top, add the following using statement just as we did before. 

```csharp
using MyAwesomeGame.Shared;
```

After adding this using statement, the error on line 22 doesn't go away like it did before.  This is because we changed the method signature for Game1 so it requires we give it a Platform value now.  We need to tell it that we are using an Android platform. Edit line 22 so that it passes the **Platform.Android** value to Game1 when it's created like the following.

```csharp
var g = new Game1(Platforms.Android);
```

Now the error should now go away.  Save and close the file.  You've probably guess what we have to do next.  If you guess that we need to edit **Program.cs** in the **MyAwesomeGame.OpenGL** project so it passes the `Platforms.OpenGL` value, then you'd be correct. Go ahead and open **Program.cs** and edit the using statement on line 17 to the following

```csharp
using (var game = new Game1(Platforms.OpenGL))
```

And that's it, we've now successfully add a new platform specific project (Android), and connected it to use the same shared code logic that is used by our other project.  And we can separate logic based on platforms if we need to

## Creating A Single Content Project
With the way things are setup right now, all of our game logic will be created in our shared project.  This is then shared out to the our individual OpenGL and Android projects to use.  However, both of those projects contain their own *Content.mgcb* file.  This means when we want to add a new content file to our game, we have to add it twice, one to each project. This is no good and runs against the whole goal of what we're achieving. So lets fix this.

First, lets add one more project to our solution.  Right-click the solution in the *Solution Explorer* window and select **Add > New Project...** to open the *New Project* window.  Next, click **MonoGame** under **Visual C#** on the left, then select the **MonoGame Windows Project** item.

![select-monogame-windows.png](tutorials/multiplatform-game-development-with-monogame/select-monogame-windows.png)

Next, give it a name at the bottom. Let's call this one **MyAwesomeGame.Content**, appending the *.Content* since this is where we'll be adding all of our game content.  As always, be sure to click the *Browse* button and select the **class-library-example** directory we created at the beginning of the tutorial, the click the *Ok* button.

![give-content-project-name.png](tutorials/multiplatform-game-development-with-monogame/give-content-project-name.png)

Once you click the Ok button, Visual Studio will generate the project for us.  When it's done, locate the **MyAwesomeGame.Content** project in the *Solution Explorer* panel and expand it if it is not already so we can see all of the files associated with it.  Next, delete all of the files under that project EXCEPT for the **Content** directory and the **Content.mgcb** file located inside it.  We don't need any of the other files except this.

Now we need a way of telling the OpenGl and the Android projects to use the *Content.mgcb* file under our Content project instead of their own.  To do this, first locate the **Content.mgcb** file in the **Content** directory for the **MyAwesomeGame.Android** project in the *Solution Explorer* window.  Then right-click it and select **Delete**.  Then do the same in the **MyAwesomeGame.OpenGL** project.

Next, right-click the **Content** directory under the **MyAwesomeGame.Android** project in the *Solution Explorer* panel and select **Add > Existing Item...**.  Navigate to the **class-library-example** directory we created.  Then open the **MyAwesomeGame.Content** directory, and then open the **Content** directory inside of it.  Single click (not double) the **Content.mgcb** file located in this directory.  Next, notice that the **Add** button in the bottom right of the *Add Existing Item* window has a little arrow on it's right side.  Click this, and select the **Add As Link** option.

![add-content-as-link.png](tutorials/multiplatform-game-development-with-monogame/add-content-as-link.png)

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">Don't See The File</span>
    </div>
    <div class="card-body">
        <p>
            When you open the MyAwesomeGame.Content/Content directory and go to select the <b>Content.mgbc</b> file above, you may actually instead see an empty directory with no files.  If this happens, click the dropdown located at the bottom right of the window and change it from <i>Visual C#</i> to <b>All Files</b>.  Then you should see it.
        </p>
    </div>
</div>

By clicking the *Add As Link* option, we're not actually adding the *Content.mgcb* file to our Android project. Instead, anytime the Android project references the Content.mgcb file, for instance when it compiles, it will instead now use the Content.mgcb file located in our Content project.  So now, do the same steps we did just now to add the **Content.mgcb** file to the **MyAwesomeGame.OpenGL** project, but remember to use the **Add As Link** option.

There is one last thing we need to do.  When we added the **Content.mgcb** files back to the projects as *Exiting Items*, the no longer contain the correct **Build Action** property, so we need to set that.  First, select the **Content.mgbc** file under the **MyAwesomeGame.Android** project in the *Solution Explorer* panel.  Then in the *Properties* panel, for the **Build Action**, change it to **MonoGameContentReference**.

build-action.png
![build-action.png](tutorials/multiplatform-game-development-with-monogame/build-action.png)

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">Where Is The Property Panel?</span>
    </div>
    <div class="card-body">
        <p>
            If you do no see the property panel in Visual Studio, you may have hidden or closed it by accident.  If so, you can reopen it by clicking <b>View > Property Window</b>
        </p>
    </div>
</div>

Once you have changed the *Build Action*, do the same steps for the **Content.mgcb** file in the OpenGL project.

Now lets test that they are all using the same Content project.  First, located the **Content.mgcb** file under the **MyAwesomeGame.Content** project in the *Solution Explorer* panel and open it to launch the *MonoGame Pipeline Tool* window.  Add a new *SpriteFont Description* item and name it **font**.spritefont.

![add-sprite-font.png](tutorials/multiplatform-game-development-with-monogame/add-sprite-font.png)

Once you've finished adding it, save and close the window. Now, open the **Content.mgcb** file for either the Android project or the OpenGL project, you should see that both of them have the **font.spritefont** item listed. Now all projects are using the same single shared content file.

## Testing Our Projects
For the last part of this section of the tutorial, lets test our two projects to see another example of how we can write our code in once place and manage the differences needed for the platforms using the `#if` directive.

First, open the locate and open the **Game1.cs** file under **MyAwesomeGame.Share** in the *Solution Explorer* panel.  Make a new line after line 14 where added the Platforms field and create a new SpriteFont field named **font**.

```csharp
SpriteFont font; 
```

Next, scroll down to the `LoadContent` method and change it to the following so we are loading in our spritefont file

```csharp
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);

            //  Load our spritefont file
            font = Content.Load<SpriteFont>("font");
        }
```

Finally, scroll down to the `Draw` method and change it to the following

```csharp
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Black);

            spriteBatch.Begin();
            if (Platform == Platforms.Android)
            {
                spriteBatch.DrawString(font, "Hello World! This is the Android project", new Vector2(100, 100), Color.White);
            }
            else if (Platform == Platforms.OpenGL)
            {
                spriteBatch.DrawString(font, "Hello World! This is the OpenGL project", new Vector2(100, 100), Color.White);

            }
            spriteBatch.End();

            base.Draw(gameTime);
        }
```

Now, according the the code above, when we run our game on an android device, it should display the *Hello World! This is the Android Project*, and when we run this on a Desktop as the OpenGL project it should display *Hello World! This is the OpenGL project*.  So lets test this.

First, make sure **MyAwesomeGame.OpenGL** is set as the StartUp Project.  To do this, right-click it in the *Solution Explorer* window and select **Set as StartUp Project**.  Then click the **Start** button at the top of Visual Studio.  The game will launch and you should see the following message displayed

![opengl-game-launch.png](tutorials/multiplatform-game-development-with-monogame/opengl-game-launch.png)

Pretty cool huh?  If you have an android device, we can also test the Android project directly on you device.  If you do not have an android device, feel free to skip to the next section. 

To test on your android device, first you need to make sure you have **Deveioper Options** unlocked and **USB Debugging** enabled.  To do this, on your device go to **Settings > About Phone > Software Information**.  Scroll down to where it lists the **Build Number** and tape the **Build Number** seven times.  Once finished, you'll receive a message about the **Developer Options** now being avaialble.  Next go to **Settings > Developer Options** and scroll down to **USB Debugging** and toggle it on.  This allows us to perform application debugging using our Android device when it's connected to a computer via USB.  

Next, make sure the device screen is on and unlocked if you have to enter a password or pin to open it.  Then connect the device to your computer via a USB cable. Once you do, you'll receive a message popup on the device asking for permission for USB debugging for your computer.  Click to accept this.

Finally, in Visual Studio, locate the **MyAwesomeGame.Android** project in the *Solution Explorer* window, right-click it and select **Set as StartUp Project**.  Once you do, the **Start** button at the top of Visual Studio will change to the name of your Android device.  If you click the Start button now, Visual Studio will build the android apk, push it to your android device and automatically launch it.  When it does, you should see the game with the Android message this time.

## Conclusion
In this approach, we created a C# class library that uses the MonoGame.Framework.Portable package. This class library is where we will develop all of our game code for our game.  When we need to differentiate between platforms for any specific reason in our code, we can use the static property we created in the Game1 class.  We have a separate single project used to manage all of the content we need to add to our game, and just like our class library, all other projects reference this.

This approach works, but it's not the the most efficient one. For one reason, when our class library is compiled to a dll, it contains the logic for the different platforms, even though they are separated by the if statements.  However, we want to be efficient and make our game build as small as possible.  We don't want the build for our Android game, on a mobile device with limited storage, to contain the code for our Desktop game if it doesn't need it.  And we also have to ensure that when we distribute our game, the **.dll** that the class library project creates is distributed with it. What a hassle.

In the next approach, we'll look at using a C# Shared Project. Using this will give the same ultimate goal of keeping our game logic in once project that our platform specific projects reference.  However, the difference here will be that with the user of a preprocessor directive, any time code is written specifically for one project type, only that code will be complied instead of all of it.  Plus, we won't have to include dll files in our final distribution.




