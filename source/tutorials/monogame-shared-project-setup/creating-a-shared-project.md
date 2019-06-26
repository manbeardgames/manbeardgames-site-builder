# Creating A Shared Project
The first project that we need to add to our solution is a **Shared Project**.  To do this, right-click on the solution in the *Solution Explorer* window, and select **Add > New Project**.  This will open the *New Project* window. 

In here, select **Visual C#** on the left, the scroll down to find and click the **Shared Project** template.

![monogame shared project](tutorials/monogame-shared-project/monogame-shared-project.png)

Next, give the shared project a name.  To help stay organized, lets name this **MyAwesomeGame.Shared**.  Note that I added the **.Shared** as part of the name.  This helps us to visually identify which project is our *Shared* project once we start adding others.  Click the **Browse** button and choose the directory we created before that we put our solution (.sln) file in.  

![monogame shared project name](tutorials/monogame-shared-project/monogame-shared-project-name.png)

Once you've finished, click the **Ok** button.  This will generate a shared project for us in our Solution. This project is where we are going to write all of the code for our game.  For now, lets move on and add our first MonoGame project.