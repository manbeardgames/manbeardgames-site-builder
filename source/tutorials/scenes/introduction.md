<div class="container post">

# Welcome
Hello, and welcome to this tutorial series.  In this series we'll be discussing the concept of using Scenes in MonoGame, using transitions between scenes, and latter we'll incorporate entity-component management into the scenes for our game objects.  Scenes are an interesting concept in game development, and there is no one absolute correct way to do it.  This is just one possible way, so feel free to explore the ideas learned here and turn it into something of your own.

So let me extand a thank you to for going through this tutorial series and I hope you are able to learn something from it.  Feedback is always appreciated, the best way to do that is to drop me a message or tweet on twitter at [@manbeardgames](https://www.twitter.com/manbeardgames)

# Who Is This Tutorial Series For
This tutorial series is for anyone interested in game development in general. While the code here makes use of the MonoGame framework, the concepts and ideas can be applied to virtually any game development framework you're using.  

# What You Will Need
If you want follow along with the tutorial by typing the code yourself (highly recommended), then you will need to ensure you have a few things setup first locally on your computer.  First, let me prefece this by saying that all development and code written during this tutorail series has been done using a Windows 10 Home Edition PC.  We'll be using the MonoGame Cross Platform Desktop project template to ensure compatability for anyone using Mac or Linux while following along. I can only speak for the setup needed for a Windows PC at this time, so the things listed below take that into account
* Windows, Mac, or Linux PC.
* Visual Studio 2017 Community Edition (Windows PC) or the IDE you have setup to work with MonOGame if using Mac or Linxu.
* MonoGame SDK - You can download and install this on the [downloads page on the MonoGame website](https://www.monogame.net/downloads)


# Prerequsite Learning
I'm going to try and keep this tutorial series as simple as possible when it comes to the concept used in C#.  However, I will need to use some concepts that may seem just above a beginning C# level.  I'm going to list these here with appropriate links to documentation on the concepts.
* Abstract Class
* Abstract and Virtual Methods
* IEnumerable and IEnumerable<> Interfaces

# Source Code
All source code for this tutorial series is avaialble for free on GitHub at [this website here](http://www.github.com/manbeardgames).  The source code is licensed under the [MIT License](http://www.github.com/manbeardgames).

## Source Code Tags
The source code has been setup to allow anyon to follow along easily without haaving to have the final finsihed version of the project source code.  This has been done using the `git tags` to mark specific points in the repository that you can checkout.  This always ensure that anyone using the source code while following along with the tutorial will always have available to them the appropriate source code up to the point of the tutorial they are in.  

To do this, at the beginning of each section of the tutorial you will be given a `git checkout` command.  Using the command exactly as it is typed will ensure that your source code is only up to that point in the tutorial.

If, instead, you would rather just have the full finished source code at all times, then you can just clone the source code repository and skip all `git checkout` commands listed throughout the series.

# Acknowledgements
Before we move on to the tutorial, I would like to take a moment to make some acknowledgements.

First, I would like to thank Porble Games ([@PorbleG](https://www.twitter.com/PorbleG)) for providing the original source code for the scene transitions section.  I first saw this transition effect on a tweet they had posted and inquired about it.  With their permission, i have included it in this tutorial.  Be sure to go to their [twitter](https://www.twitter.com/PorbleG) and check out the clever puzzle game they are making called Wark & Wimble.

I would also liek to thank the Game Dev's Quest community. The disucssions from everyone and see the progress everyone is making on individual projects has helped to keep me motivated throughout my many projects.  You can find more information on Game Dev's Quest at https://www.gamedevsquest.com

And lastly, I would like to thank you.  Game development is hard, no matter what framework or engine you decide to use, so keep pushing through and follow that dream.

</div>