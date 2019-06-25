# Getting Started
To get started, we're first going to need to setup some structure to our project so we can keep track of things. This is my recommendation on doing this, however feel free to use whatever directory, solution name, project name setup you are most comfortable with.

Typically, when you create a new project in Visual Studio, be it for MonoGame or some other project type, Visual Studio will automatically create the solution (.sln) file for you, and create a new directory to put your project in.  This is usually ok to do when when you only have one project as part of the overall solution. However we're going to have multiple, so we need to think about doing some organiztion ourselves.

First, create a new folder somewhere on your computer.  This folder is where we are going to put everything, our solution (.sln) file and our projects. For the purpose of this tutorial, I'm going to call this folder **my-awesome-game**

Next, open Visual Studio if you do not already have it open, and select **File > New > Project** from the menu at the top.  In the *New Project* window that opens, type **Blank Solution** into the search box at the top right. This should give you only one result called *Blank Solution*.  Click this to choose it.

![blank-solution]

At the bottom of the *New Project* window, enter a name for our solution. I'm going to enter **MyAwesomeGame**.  Next, click the **Browse** button and choose the folder that we just created previously.  Make sure that the **Create directory for solution** is NOT checked. Then click the **Ok** button.

![blank-solution-name]

Once this is finished, in Visual Studio you should see that we have the solution you just created open with no projects listed in the *Solution Explorer* window.  Next we'll start adding and setting up the projects.