---
title: Setting Up MonoGame
spine: setting-up-monogame
short: How to setup your environment to get ready to make games with MonoGame
layout: tutorials
date: November 27th, 2018
ogtitle: Setting Up Monogame
ogimage: https://manbeardgames.com/img/ogmbg.png
ogdescription: How to setup your environment to get ready to make games with MonoGame
---
<!-- <div class="container post"> -->

# Setting Up MonoGame
---  
So you're ready to get started with MonoGame, but have no idea what to do to start. Well the first step would be to get the 
neccessary software installed.    All of the software needed to get started is completely free. We're going to neeed

* Visual Studio
* MonoGame  

That's it. So let's get started

## Installing Visual Studio
--- 
The first thing we're going to need is Visual Studio.  Visual Studio is an IDE, or Integrated Development Environment, from Microsoft. 
As of this writing, we'll be downloading Visual Studio 2017.

### Which Edition of Visual Studio To Choose
Visual Studio comes with different editions: Community, Professional, and Enterprise.  Microsoft provides a breakdown of the differences between
each version on the [Compare Visual Studio 2017 IDE](https://visualstudio.microsoft.com/vs/compare/) page.  For the purposes of these tutorials, 
getting the Community Edition should be all you need.

### Downloading and Installing Visual Studio
To begin downloading, head over to the download page at https://visualstudio.microsoft.com/vs/compare/ and downloading the Community Edition. If you
feel you need to get the Professional or Enterprise Editions then do so, however as stated before, these tutorials will be written with only the Community Edition in mind.  

Once the download finished, run the installer to begin installing Visual Studio.  It will ask you which components and workloads you want to install as part of the process.  Look over this list to see what's there, and if there is anything you thing you may have interest in, you can choose it now.  If you don't choose something now, you can always add it later by rerunning the installer which will allow you to modify your installation and choose additional workloads and components.  For now, the only thing we need at minimum is the .NET Desktop Development workload.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Psiren.Scenes
{
    public class Scene
    {
    }
}

```

## Installing MonoGame
--- 
Now that we have Visual Studio installed, we need to install MonoGame. This isn't a seperate application that we'll be running, instead the installation will install
project templetes for us to choose from in Visual Studio when we go to make a new game.  You can head over to the MonoGame download page at http://www.monogame.net/downloads/ to grab the latestest version.  As of this writing, that would be **MonoGame 3.7**. When you click to download it, it may direct you to a forum post on the MonoGame community forums with different options to choose from.  You'll want the **MonoGame 3.7 for Visual Studio** one.

## Finished
--- 
Now that we have Visual Stuido and MonoGame installed, we can begin making games.  We'll cover some of the core concepts for MonoGame in the next tutorial.

<!-- </div> -->