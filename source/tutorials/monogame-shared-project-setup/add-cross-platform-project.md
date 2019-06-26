# Add Cross Platform Project
The first project type that we're going to add is a **MonoGame Cross Platform Desktop Project**.  To do this, right-click the solution in the *Solution Explorer* and select **Add > New Project**.  In the *New Project* window that opens, click **MonoGame** on the left under *Visual C#*, then select the **MonoGame Cross Platform Desktop Project** template.  

![choose cross platform project](tutorials/monogame-shared-project/choose-cross-platform-project.png)

Next, just like before, we need to give our project a name.  This time, I'm going to use the name **MyAwesomeGame.Desktop**.  I'm adding the **.Desktop** at the end since this is the project for Desktop builds.  After giving it a name, click the **Browse** button and select the folder we setup at the beginning of the tutorial.  Then click **Ok** to create the project.

![cross platform name](tutorials/monogame-shared-project/cross-platform-name.png)

You should now see the *MyAwesomeGame.Desktop* project added to the solution in the *Solution Explorer* window. Next we need to "connect the wires" so to speak between this project and the shared project.