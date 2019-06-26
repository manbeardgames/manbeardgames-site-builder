# Wrap Up
That's all you need to do to start developing your game for multiple platforms.  From this point on, you'll develop the game inside the Shared project just as you would normally.  Use the **.Content** project when you need to add content items with the Pipeline Tool. When you build the Desktop and/or Android projects, they'll refrence the code from the Shared project for their build.  Make use of the `#if` preprocessor directive for any sections of code that you need to be different between platforms, and you'll be good to go.

Happy dev-ing!