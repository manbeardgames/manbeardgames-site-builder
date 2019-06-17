<div class="container post">

# Overview
---
When first starting a new MonoGame project, you're given the Game1.cs templete. When starting out, this is good for experimenting and learning the core concepts in MonoGame.  As your game projects grow, eventually the Game1 templete will need to be broken out into logical groupings of levels or screens in order to better manage your code.  

This tutorial will go over one way of doing this, by creating what we'll call Scenes.

# Project Files
---
If you would like to follow along with this tutorial using the same files and assets I use, you can find them [here on github](https://github.com/manbeardgames/manbeardgames-site-tutorials/tree/master/tutorials/creating-scenes).
  
  
  
## What is a Scene
---
You can think of a Scene as the individual screens of your game. This could be things such as your title screen or you individual levels within your game.  A Scene's primary purpose is to emulate what we do in the Game1 class such as updating and rendering, but on a per scene bases to help us better organize and manage our code.  

We can further expand this idea of a Scene by implementing the idea of Game Objects or Entities, and Components.  This setup would be similar to something like Scenes in Unity in that each Scene contains game objects, and you attach component scripts to the game objects.  

<div class="card text-white bg-dark mb-3">
    <div class="card-header">
        <span class="lead">
            Note:
        </span>
    </div>
    <div class="card-body">
        <p>In this concept, we'll have Scenes that are composed of game objects, and game object's will be composed of components.  This is not to be confused with an Entity-Component-System (ECS) architecure, which works in a fundimentally different way.
    </div>
</div>
  
  
  
## The Scene Class
---
Let's dive right into this. To get started, open Visual Studio and create a new MonoGame Cross Platform Desktop project.  For this tutorial, we'll call it SceneExample.  Once the project is created, add a new class called `Scene`. This is going to be the base class for all scenes that are created for our game.

Let's add two new methods to our Scene class, the `Update` and `Draw` methods.

```csharp
public virtual void Update()
{

}

public virtual void Draw(SpriteBatch spriteBatch)
{

}
```

The `Update()` is where we can place all of the update logic for our scene.  The `Draw(SpriteBatch spriteBatch)` method is where we'll do all of our rendering for the scene. Both of these methods are `virtual` so that we can override them in the actual classes we create to implement our scene.  Pretty straight forward so far.

We'll come back to the Scene class, but for now, lets move on to our next concept we'll introduce
  
  
  
## The Entity Class
---
Our scenes are going to be comprised our our game objects that will get updated and rendered from the scene they belong to.  We're going to call these Entities.  Entities further on are going to be comprised of Component scripts, which we'll talk about in the next section.  The Component scripts are going to provide rendering capabiliies and logic to our Entities.  

For now, lets create the base of our Entity class.  Create a new class called Entity and add the following

```csharp
public class Entity
{
    //  Is the entity active (can it be updated)
    public bool Active { get; set; } = true;

    //  Is the entity visible (can it be rendered)
    public bool Visible { get; set; } = true;

    //  The xy-coordinate position of the entity
    public Vector2 Position;

    //  The scene that the entity lives within
    public Scene Scene { get; set; }

    /// <summary>
    ///     Creates a new entity at the xy-coordinate position given
    /// </summary>
    /// <param name="position">The xy-coordinate position of the entity</param>
    public Entity(Vector2 position)
    {
        Position = position;
    }

    /// <summary>
    ///     Creates a new entity with a position of {0, 0}
    /// </summary>
    public Entity() : this(Vector2.Zero)
    {

    }

    /// <summary>
    ///     Updates the entity
    /// </summary>
    public virtual void Update()
    {

    }

    /// <summary>
    ///     Renders the entity to the screen
    /// </summary>
    /// <param name="spriteBatch"></param>
    public virtual void Draw(SpriteBatch spriteBatch)
    {

    }

    /// <summary>
    ///     Called by the scene when this entity is added to it
    /// </summary>
    /// <param name="scene"></param>
    public virtual void Added(Scene scene)
    {
        Scene = scene;
    }

    /// <summary>
    ///     Called by the scene when this entity is removed from it
    /// </summary>
    /// <param name="scene"></param>
    public virtual void Removed(Scene scene)
    {
        Scene = null;
    }
}
```


This is the skeleton of our Entity class.  We'll be coming back to this to add more in a minute, but for now, we need to move on to our final concept, the Component
  
  
  
## The Component class
---
The Component class is what we'll use to create the logic for our entities and/or the rendering.  Not all components need to render, so because of this we'll actually create two types of Component classes, the `Component` and the `GraphicalComponent`.

To start with, lets first create the Component class. Add a new class called Component, then add the following to it

```csharp
public class Component
{
    //  Is the component active (updatable)
    public bool Active { get; set; }

    //  The entity this component is attached too
    public Entity Entity { get; private set; }

    //  The scene this component's entity is apart of
    public Scene Scene
    {
        get
        {
            if(Entity != null)
            {
                return Entity.Scene;
            }
            else
            {
                return null;
            }
        }
    }

    /// <summary>
    ///     Creates a new component instance
    /// </summary>
    /// <param name="active"></param>
    public Component(bool active)
    {
        Active = active;
    }

    /// <summary>
    ///     Updates the component. Method should be overridden
    ///     by the implementing class
    /// </summary>
    public virtual void Update() { }

    /// <summary>
    ///     Called by the entity when this component is attached
    ///     to it
    /// </summary>
    /// <param name="entity"></param>
    public virtual void Added(Entity entity)
    {
        Entity = entity;
    }

    /// <summary>
    ///     Called by the entity when this component is removed from
    ///     it
    /// </summary>
    /// <param name="entity"></param>
    public virtual void Removed(Entity entity)
    {
        Entity = null;
    }
}

```

Next is the GraphicComponent. Create a new class called GraphicComponent and add the following

```csharp
//  GraphicComponent inherits from Component
public abstract class GraphicComponent : Component
{
    //  The xy-coordinate position of the component
    //  relative to the xy-coordinate position of the entity
    //  it is attached to
    public Vector2 Position;

    //  The xy-coordinate position to render the component at.
    //  Takes into account the position of the Entity it is attached
    //  too and the components relative position
    public Vector2 RenderPosition
    {
        get
        {
            if(Entity == null)
            {
                return Vector2.Zero;
            }
            else
            {
                return Entity.Position + Position;
            }
        }
    }

    //  The origin value used when rendering with the sprite batch
    public Vector2 Origin;

    //  The xy-scale of the render
    public Vector2 Scale = Vector2.One;

    //  The color mask used when rendering
    public Color Color = Color.White;

    //  Is this component visible (can it be rendered)
    public bool Visible { get; set; } = true;

    /// <summary>
    ///     Creates a new instance of a GraphicComponent
    /// </summary>
    /// <param name="active"></param>
    public GraphicComponent(bool active):base(active)
    {

    }

    /// <summary>
    ///     Renders the component to the screen
    /// </summary>
    /// <param name="spriteBatch"></param>
    public virtual void Draw(SpriteBatch spriteBatch) {  }    
}
```

Now that we have the base entity and component arcitectures in place, we're almost ready to put it all together.  First we'll need some way of manging and keeping track of the components that have been added to an entity, as well as the entities that have been added to our scene. 
  
  
  
## The ComponentList
---
The ComponentList is exactly what it sounds like. It's a class that will allow us to logically manage and track the components that have been added to an entity.  

Create a new class called ComponentList.  Add the following 

```csharp
public class ComponentList
{
    //  The main list of components
    private List<Component> _components;

    //  The components that need to be added to the 
    //  main list
    private List<Component> _toAdd;

    //  The components that need to be removed from the
    //  main list
    private List<Component> _toRemove;

    //  The Entity this component list belongs to
    public Entity Entity { get; private set; }

    /// <summary>
    ///     Creates a new component list instnace
    /// </summary>
    /// <param name="entity">The entity this belongs too</param>
    public ComponentList(Entity entity)
    {
        _components = new List<Component>();
        _toAdd = new List<Component>();
        _toRemove = new List<Component>();

        Entity = entity;
    }

}
```

There are three lists within here.  The `_components` list is our main list of current components.  The `_toAdd` and `_toRemove` lists track which components need to be added or removed from the main list.  This is to help prevent exceptions in instances where we are iterating the main list, but also need to add to it.  

Next, lets add the method we'll use to keep these lists updated.  Add the following method to our ComponentList class

```csharp
/// <summary>
///     Updates the lists of components
/// </summary>
private void UpdateLists()
{
    //   If we have components to add, iterate them
    //   and add them to the main list. 
    if(_toAdd.Count > 0)
    {
        foreach(var component in _toAdd)
        {
            _components.Add(component);

            //  Tell the component it was added to the Entity
            component.Added(Entity);
        }
    }

    //  Clear the _toAdd list
    _toAdd.Clear();

    if(_toRemove.Count > 0)
    {
        foreach(var component in _toRemove)
        {
            _components.Remove(component);

            //  Tell the component it was removed from the Entity
            component.Removed(Entity);
        }
    }

    //  Clear the _toRemove list
    _toRemove.Clear();
}
```

This will take any components in the `_toAdd` list and add them to the main list, and remove any in the `_toRemove` list.

Next lets add our helper methods for adding and removing components from the list. Add teh following methods

```csharp
/// <summary>
///     Adds the given component to the list
/// </summary>
/// <param name="component">The component to add</param>
public void Add(Component component)
{
    _toAdd.Add(component);
}

/// <summary>
///     Removes the given component from the list
/// </summary>
/// <param name="component">The component to remove</param>
public void Remove(Component component)
{
    _toRemove.Add(component);
}
```

Now that we can successfully add and remove components, lets add the methods for updating the components in the list and rendering those that need to be rendered.  Add the following methods

```csharp
/// <summary>
///     Updates the components
/// </summary>
public void Update()
{
    //  First ensure our list is up to date
    UpdateLists();

    foreach(var component in _components)
    {
        //  Only update if component is active
        if(component.Active)
        {
            component.Update();
        }
    }
}

/// <summary>
///     Renders the components
/// </summary>
/// <param name="spriteBatch"></param>
public void Draw(SpriteBatch spriteBatch)
{
    foreach (var component in this._components)
    {
        //  Only do GraphicComponents
        if (component is GraphicComponent graphicComponent)
        {
            //  Only render if component is visible
            if (graphicComponent.Visible)
            {
                graphicComponent.Draw(spriteBatch);
            }
        }
    }
}
```

The Update method first ensures that our lists are up-to-date, then it will call the Update method on any component that is active.  The Render method will go through only the GraphicComponent types and render those that are visible

The last thin we need to do is provide a way of pulling components out of the list.  To do this, we're going to make use of the `T` generic methods in C#.  Add the following two methods

```csharp
/// <summary>
///     Gets the first component of type T from the list
/// </summary>
/// <typeparam name="T">The type of Component</typeparam>
/// <returns>The component if found; null otherwise</returns>
public T Get<T>() where T : Component
{
    //  Go through all of the components. Return back the 
    //  first instance of a component that is of type T
    foreach(var component in _components)
    {
        if(component is T)
        {
            return component as T;
        }
    }

    //  If no components were found, return null
    return null;
}

/// <summary>
///     Gets components of type T
/// </summary>
/// <typeparam name="T">The type of Component</typeparam>
/// <returns></returns>
public IEnumerable<T> GetAll<T>() where T : Component
{
    //  Go through all of the components.  Return back
    //  each instance of a component that is of type T
    foreach(var component in _components)
    {
        if(component is T)
        {
            yield return component as T;
        }
    }
}
```

The `Get<T>()` method will get the first component in the list that is of the type we provide for `T`.  For example, we could say `Get<Foo>()` and it would return the first `Foo` component in the lsit.

The `GetAll<T>()` method uses the `IEnumerable<T>` return type to get all components of the given type.

That's it for out ComponentList.  Now that we've created that, lets add it into our Entity class.  Go to the Entity class and add the following property just after the Scene property and initialize it in the constructor

```csharp
//  The list of components for this entity
public ComponentList Components { get; private set; }

/// <summary>
///     Creates a new entity at the xy-coordinate position given
/// </summary>
/// <param name="position">The xy-coordinate position of the entity</param>
public Entity(Vector2 position)
{
    Position = position;

    //  Initilize the component list
    Components = new ComponentList(this);
}
```

Next modify the `Update` and `Draw` method of our Entity class to update and draw our components

```csharp
/// <summary>
///     Updates the entity
/// </summary>
public virtual void Update()
{
    //  Update the components
    Components.Update();
}

/// <summary>
///     Renders the entity to the screen
/// </summary>
/// <param name="spriteBatch"></param>
public virtual void Draw(SpriteBatch spriteBatch)
{
    //  Draw the components
    Components.Draw(spriteBatch);
}
```

And finally, add the `Add` and `Remove` methods so we can add and remove components from the Entity

```csharp
/// <summary>
///     Adss the given component to the entity
/// </summary>
/// <param name="component">The component to add</param>
public void Add(Component component)
{
    Components.Add(component);
}

/// <summary>
///     Removes the given component from the entity
/// </summary>
/// <param name="component">The component to remove</param>
public void Remove(Component component)
{
    Components.Remove(component);
}
```

Now that we can track and manage components form the entities using our ComponentList, we're going to do the same thing to track and manage our entities in our scenes by creating an EntityList
  
  
  
## The EntityList
---
The EntityList is fundimentally going to work the same way the ComponentList did.  So to save some time typeing and you reading, I'll present the code here for you and provide any explinations in the comments.

Create a new class called EntltyList and add the following

```csharp
public class EntityList
{
    //  The main list of entities
    private List<Entity> _entities;

    //  The entiies that need to be added to the 
    //  main list
    private List<Entity> _toAdd;

    //  The entities that need to be removed from
    //  the main list
    private List<Entity> _toRemove;

    //  The Scene this entity list belongs too
    public Scene Scene { get; private set; }

    /// <summary>
    ///     Creates  anew entity list instnace
    /// </summary>
    /// <param name="scene">The scene this belongs too</param>
    public EntityList(Scene scene)
    {
        _entities = new List<Entity>();
        _toAdd = new List<Entity>();
        _toRemove = new List<Entity>();

        Scene = scene;
    }

    private void UpdateLists()
    {
        //  If we have entities to add, iterate them and 
        //  add them to the main list
        if(_toAdd.Count > 0)
        {
            foreach(var entity in _toAdd)
            {
                _entities.Add(entity);

                //  Tell the entity it was added to the scene
                entity.Added(Scene);
            }
        }

        //  Clear the _toAdd list
        _toAdd.Clear();

        if(_toRemove.Count > 0)
        {
            foreach(var entity in _toRemove)
            {
                _entities.Remove(entity);

                //  Tell the entity it was removed from teh scene
                entity.Removed(Scene);
            }
        }

        //  Clear the _toRemovelist
        _toRemove.Clear();
    }

    /// <summary>
    ///     Adds the given entity to the list
    /// </summary>
    /// <param name="entity">The entity to add</param>
    public void Add(Entity entity)
    {
        _toAdd.Add(entity);
    }

    /// <summary>
    ///     Removes the given entity from the list
    /// </summary>
    /// <param name="entity">The entity to remove</param>
    public void Remove(Entity entity)
    {
        _toRemove.Add(entity);
    }


    /// <summary>
    ///     Updates the entities
    /// </summary>
    public void Update()
    {
        //  First ensure our list is up to date
        UpdateLists();

        foreach(var entity in _entities)
        {
            //  Only update if the entity is active
            if(entity.Active)
            {
                entity.Update();
            }
        }
    }

    /// <summary>
    ///     Renders the entities
    /// </summary>
    /// <param name="spriteBatch"></param>
    public void Draw(SpriteBatch spriteBatch)
    {
        foreach(var entity in _entities)
        {
            //  Only render if entity is visible
            if(entity.Visible)
            {
                entity.Draw(spriteBatch);
            }
        }
    }

    /// <summary>
    ///     Gets the first entity of type T from the list
    /// </summary>
    /// <typeparam name="T">The type of entity</typeparam>
    /// <returns>The entity if found; null otherwise</returns>
    public T Get<T>() where T : Entity
    {
        //  Go through all of the entities.  Rentur back the
        //  first instance of an entity that is of type T
        foreach(var entity in _entities)
        {
            if(entity is T)
            {
                return entity as T;
            }
        }

        //  If no entity was found, return null
        return null;
    }

    /// <summary>
    ///     Gets entities of type T
    /// </summary>
    /// <typeparam name="T">The type of entity</typeparam>
    /// <returns></returns>
    public IEnumerable<T> GetAll<T>() where T : Entity
    {
        //  Go through all of the entities.  Return back
        //  each instance of a entity that is of type T
        foreach (var entity in _entities)
        {
            if (entity is T)
            {
                yield return entity as T;
            }
        }
    }

}
```

Now we just need to modify the Scene class to make use of our Entitylist.  Go to the Scene class and add the following property and initilzie it in the constructor

```csharp
//  The list of entities for this scene
public EntityList Entities { get; private set; }

public Scene()
{
    //  Initilize the entity list
    Entities = new EntityList(this);
}
```

Next modify the `Update` and `Draw` methods of the Scene class to update and draw the entities

```csharp
/// <summary>
///     Updates the scene
/// </summary>
public virtual void Update()
{
    Entities.Update();
}

/// <summary>
///     Renders the scene
/// </summary>
/// <param name="spriteBatch"></param>
public virtual void Draw(SpriteBatch spriteBatch)
{
    Entities.Draw(spriteBatch);
}
```

And finally create the `Add` and `Remove` methods that we can use to add and remove entities from the scene

```csharp
/// <summary>
///     Adds the given entity to the scene
/// </summary>
/// <param name="entity">The entity to add</param>
public void Add(Entity entity)
{
    Entities.Add(entity);
}

/// <summary>
///     Removes the given entity from the scene
/// </summary>
/// <param name="entity">The entity to remove</param>
public void Remove(Entity entity)
{
    Entities.Remove(entity);
}
```
  
  
  
## Wrapping It All Up
---
Now that we have all the pieces in place, we need to modify our Game1 class to use scenes.  This part will be pretty simple.  First open the Game1 class and add the following static properties

```csharp
//  Static refrence to the instance of the Game1 class
public static Game1 Instance { get; private set; }

//  The current scene that is being used
public static Scene CurrentScene { get; private set; }

//  The next scene that we want to use
public static Scene NextScene { get; set; }

//  The delta time between updates
public static float DeltaTime { get; private set; }
```

First we make create a static reference to our Game1 class called `Instance`.  This will be helpful whenever we need to change scenes from somewhere else, like within another scene

Next is the `CurrentScene` and `NextScene` static properties. The CurrentScene is our current active scene.  We'll use the NextScene property as a method of switch scenes in a minute.

Finally is the `DeltaTime` static property.  This will allow use to get the delta time value between updates from within our scenes instead of having to pass the GameTime object through all of the update calls

Next, modify the constructor for Game1 so that we set the `Instance` property as follows

```csharp
public Game1()
{
    //  Cache refrence of this instance
    Instance = this;

    graphics = new GraphicsDeviceManager(this);
    Content.RootDirectory = "Content";
}
```

Then modify the Update method

```csharp
/// <summary>
/// Allows the game to run logic such as updating the world,
/// checking for collisions, gathering input, and playing audio.
/// </summary>
/// <param name="gameTime">Provides a snapshot of timing values.</param>
protected override void Update(GameTime gameTime)
{
    if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
        Exit();

    //  Update the delta time
    DeltaTime = (float)gameTime.ElapsedGameTime.TotalSeconds;

    //  Update the current scene
    if(CurrentScene != null)
    {
        CurrentScene.Update();
    }

    //  If we have a NextScene, switch the current
    //  scene to that
    if(NextScene != null)
    {
        //  Set the CurrentScene as the NextScene
        CurrentScene = NextScene;

        //  Set the next scene as null
        NextScene = null;
    }

    base.Update(gameTime);
}
```

First, we get the delta time value.  Next we udpate the `CurrentScene` if we have one.  And finally, if there is a `NextScene`, we swap out the `CurrentScene` for that, and set `NextScene` to null


And finally, modify our Draw method so that we draw the current scene as such

```csharp
/// <summary>
/// This is called when the game should draw itself.
/// </summary>
/// <param name="gameTime">Provides a snapshot of timing values.</param>
protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.Black);

    //  Render the current scene
    spriteBatch.Begin();
    if(CurrentScene != null)
    {
        CurrentScene.Draw(spriteBatch);
    }
    spriteBatch.End();

    base.Draw(gameTime);
}
```

We begin and end our spritebatch here, and if the `CurrentScene` is not null, we tell it to draw, giving it our spritebatch to use.  (I also took the liberty of changing the Color used in the GraphicsDevice.Clear to Black...personal preference).


And that's it. All of the pieces are in place now for use to use.  We have a Scene through our `CurrentScene` property in Game1.  This is Updated and Drawn, which in turn updates and draws its entities, which in turn updates and draws their components.  It's "trickle down updatedrawconomics".....


Now, after you've created your first Scene class, you can start it within your Game1 by setting the CurrentScene propety to it within the `Initialize` method like so

```csharp
/// <summary>
/// Allows the game to perform any initialization it needs to before starting to run.
/// This is where it can query for any required services and load any non-graphic
/// related content.  Calling base.Initialize will enumerate through any components
/// and initialize them as well.
/// </summary>
protected override void Initialize()
{
    base.Initialize();

    //  Load your first scene here
    CurrentScene = new ExampleScene();
}
```

If you checked out the solution files listed at the beginning of this tutorial, I've included and example scene that utilizes all we've created here.  The `ExampleScene` contains one `PlayerEntity`. This entity has two components; `PlayerMovementComponent` and `Sprite`.  The PlayerMovementComponent moves the player with input, and the Sprite component will render the player.  Be sure to check it out to see how all of this wraps up 

</div>