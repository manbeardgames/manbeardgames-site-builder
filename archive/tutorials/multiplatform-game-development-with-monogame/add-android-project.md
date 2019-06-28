# Add Android Project
We want our game to be avaialble on Android devices as well right? Lets add an Android project to our solution. Just like before, right-click the solution in the *Solution Explorer* window and select **Add > New Project**.  In the *New Project* window, select **MonoGame** on the left under *Visual C#*, the select the **MonoGame Android Project**.

![choose android project](tutorials/monogame-shared-project/choose-android-project.png)

Again, just as before, give the project a name.  I'm going to call it **MyAwesomeGame.Android** using the **.Android** in the name so I know this is the Android project.  Be sure to click the **Browse** button and select the directory that we created at the beginning of the tutorial.  Then click the **Ok** button to create the project.

![android project name](tutorials/monogame-shared-project/android-project-name.png)

Once you click Ok, the **MyAwesomeGame.Android** project will be added to your solution.  Since this is an Android project, we have to create an Androidmanifest.  What this file is is not within the scope of this project, but regardless we need to create one really quickly anyway.  To do this, right-click the **MyAwesomeGame.Android** project in the *Solution Explorer* window and select **Properties**  On the left side of the properties windows click **Android Manifest**, then click the **No AndroidManifest.xml found. Click to add one** link.  See the image below for reference.

![android manifest](tutorials/monogame-shared-project/android-manifest.png)

Once it's been added, you may receive a notification about the project being modified outside the environment.  This is normal, just click **Reload All**.  Then close the properties window.

Next, we need to correct a line of code that is generated from the Android Project template.  Open the **Activity1.cs** file in your Android project.  Find the following line (it should be the one with an error)

```csharp
, LaunchMode = Android.Content.PM.LaunchMode.SingleInstance
```

and change it to 

```csharp
, LaunchMode = LaunchMode.SingleInstance
```

**Note the , at the beginning of the line, be sure to keep that**

Next, just like with the Desktop project, we need to connect the Android project to our Shared project.
