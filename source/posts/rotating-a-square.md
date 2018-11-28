---
title: Rotating A Square
short: I wanted to draw a diamond within the game window, which is essentially a square rotated 45 degrees around its center.  In this post, I'll explain how I was able to achieve that.
layout: default
date: November 26th, 2018
ogtitle: Rotating A Square
ogimage: https://manbeardgames.com/img/ogmbg.png
ogdescription: I wanted to draw a diamond within the game window, which is essentially a square rotated 45 degrees around its center.  In this post, I'll explain how I was able to achieve that.
---
<div class="container post">

# Rotating A Square
---  
Currently, I'm experimenting with drawing simple shapes in MonoGame, and tonight I wanted to do a diamond.
A diamond is just a rectangle rotated 45 degress around its center.

#### The Problem

I get asked this question a lot.  So much that I started joking on my stream that I
should write a formal statement about it on my website to link to.  I could provide
a pros and cons list of using [MonoGame vs _insert game engine of choice here_](https://www.google.com/search?q=Monogame+vs) but that
doesn't explain why _I_ use MonoGame.  Hopefully this will answer the question.

#### My Background  
---
Before understanding my answer, it's important to establish some credibility for me.
Where game development is concerned, I have experimented with a variety of engines and frameworks over the years including:
* Unity
* MonoGame
* Unreal
* XNA 4.0
* Gamemaker
* RPG Maker (95 - VX)

While my usage in most of these was mostly just hobby and experimenting and prototyping with them, I did manage to
actually finish a game and [release it on Steam](https://store.steampowered.com/app/697710/Ophidian/) on September 15th, 2017.
I developed that game using Unity, so outside of MonoGame, most of my experience and knowledge is with Unity. Because of that
I'll use it for comparision below.

#### So, Why Do I Use MonoGame
---
Alright. Are you ready for the answer?  Have your prepared your self for this mind blowing revelation of game development?
Are you sitting down?  

The reason I use MonoGame is...  

<div class="text-center">  

## It is the tool that works for me

</div>  
<p></p>  

That is the simpliest answer to that question.  However, I know that's not going to satisfy some, so let me expand on that
some more  

#### 2D Development
I work in the 2D.  I honestly have no interest in doing 3D game development.  Creating art assets is time consuming enough
when it's just sprites and sprite sheets.  Adding 3D modeling, texturing, lighting, rigging, and an entire third axis is just
so unappealing to me. Not to down play 3D games and their developers.  You guys make some amazing things, and I love playing 
those games. It's just not for me when it comes to actually developing something.

I mention 2D specifically though because an engine, like Unity, is made for 3D first. Take Unity for instance, the engine is
call Unity3D.  That's their focus first and foremost.  2D development is definitly possible with it, and there are some great
2D games made with Unity, but as an engine and its development, that's not its focus.  There are some really cool things that
have been talked about with Unity regarding the 2D side on the Unity blog, that have taken forever for them to implemnt, because
it's just not the focus of the development.

So what is MonoGames focus when the developers are working on releases?  That's a good question. Let's explore that in the following
seciton call ...

#### Framework vs Engine
MonoGame is not a game engine. It is a framework. This is a very important distinction to make and understand. A framework is
like a foundation that you build upon. When you're developing a game using a framework, your code calls the framework to perform
tasks. You have a level of control and structure over that.  

With an engine, you sacrifice that level of control by handing it off to the engine.  The code you write doesn't call and instruct
the engine what to do, instead the engine calls your code. Take Unity for example. When you create a new script and add it as
a component on a game object, the engine calls your script to perform the actions within.

I prefer having that level of control that a framework provides. Not every game needs a physics engine computing velocity and
managing collisions through complex resolutions.  Sometimes all you need is before moving a sprite to the left do a quick AABB
check.  It's simple and effecient. If I decide later that I need some physic simulation, I can not only add that in either myself
or by using a third party library like Box2D and Farseer, but I have control over how it's implemented into the game. 

Speaking of control over how things are implemented ...  

#### Open Source
MonoGame is open source.  If i'm curious about how something in the framework is performed, it's a quick check on GitHub to find
the information I need.  Don't like how something is done? Think a different approach would work better? I can download the source
and change it to fit my needs. Is there a bug in the framework or additions need to be made? I can contribute to the project.

Not only is it open source, but its free.  I don't have to pay a subscription to unlock a dark theme for the editor. I don't have
to wonder which subscription plan I need if I happen to make that instant hit game. 

Speaking of subscription plans ...

#### License
MonoGame is free. The license is simple. [Go check it out for yourself.](https://github.com/MonoGame/MonoGame/blob/develop/LICENSE.txt)  It's 86
lines of simple.  Now [Go check out Unity's license.](https://unity3d.com/legal). (I'll wait) It's multiple terms of services, agreements, policies, etc.
How many of you reading this and use Unity have read through all of that before you agreed to any of it?  

## In Conclusion  
---
Unity is great. Gamemaker is great. Unreal is great. _Your game engine of choice is great_.  Whatever tool works the best for your use case is the what
you should use.  I don't want to deter anyone from other game engines and frameworks, nor do I want to make some statement that MonoGame is the best and
better than the rest. It just happens to be the tool that works for me. So, go, find the tool that works for you. Make great games. Be extraordinary.


</div>