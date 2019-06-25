# MonoGame Shared Project
The first project that we need to add to our solution is a **MonoGame Shared Project**.  To do this, right-click on the solution in the *Solution Explorer* window, and select **Add > New Project**.  This will open the *New Project* window. 

In here, select **MonoGame** on the left under *Visual C#*, then select the **MonoGame Shared Project** template.

![monogame shared project](tutorials/monogame-shared-project/monogame-shared-project.png)

Next, give the shared project a name.  To help stay organized, lets name this **MyAwesomeGame.Shared**.  Note that I kept the **.Shared** as part of the name.  This helps us to visually identify which project is our *Shared* project once we start adding others.  Click the **Browse** button and choose the directory we created before that we put our solution (.sln) file in.  

![monogame shared project name](tutorials/monogame-shared-project/monogame-shared-project-name.png)

Once you've finished, click the **Ok** button.  This will generate a shared project for us in our Solution with a **Content** directory and a **Game1.cs** class file.

The **Content** directory contains a single **Content.mgbc** file like with other projects, however it is not "included" in the project by default, so lets do that next. First, click the **Show All Files** button at the top of the *Solution Explorer* window. I've highlighted where this button is in the image below.

![show all filess](tutorials/monogame-shared-project/show-all-files.png)

Clicking this will show the files that are in the directory but haven't been incuded as part of the project. Once you click it, you should now be able to expand the **Contents** directory to see the *Content.mgbc* file. 

![content file shown](tutorials/monogame-shared-project/content-file-shown.png)

Right click on the **Content.mgbc** file and select **Include in Project**.  The icon should change to the MonoGame icon for the file once you've done this.  Next click the **Show All Files** button again to turn it off, and the *Content.mgbc* will remain visible.

![content file added](tutorials/monogame-shared-project/content-file-added.png)



