# Site Generator
This is a simple static site generator using Node.js and EJS templetes.  

## Download/Setup
Download or clone the repository locally.

Install the dependencies listed in the **package.json** by using the following command
``` npm install ```

The following dependencies will be added. (for the sake of brevity the dependencies of these dependencies are not listed)
*  bootstrap ^4.1.3
*  ejs ^2.6.1
*  front-matter ^3.0.1
*  fs-extra ^7.0.1
*  glob ^7.1.3
*  jquery ^3.3.1
*  marked ^0.5.1
*  sass ^1.14.3

## Directory Structure
The following is the default directory structure.  You can modify this to your needs in the **site.config.js** file. This will be explaing later in that section
```
+-- build/
|   +-- css/
|   +-- img/
|   +-- js/
|   +-- vendor/
+-- scripts/
+-- source/
|   +-- data/
|   +-- img/
|   +-- js/
|   +-- layouts/
|   +-- pages/
|   +-- partials/
|   +-- scss/
```

##### build/
This is the directory where the built static site will go. This directory is deleted and rebuilt each time you use the ``npm run build`` command

##### Build/css/
When your site it built, all of the SASS files that are converted to CSS are placed here

##### build/img/
When your site is built, all of the image files you have placed in the ```source/img``` folder are copied here, including the directory structure.

##### build/js/
When your site is built, all of the javascript files you have placed in the ```source/js``` folder are copied here, including the directory structure.


##### build/vendor/
When your site is built, all of the vendor files specified in ```site.config.js``` are copied here. By default, this includes bootstrap and jqeuery


##### scripts/
This directory contains the ```build.js``` script that is used to build the site when you run the ```npm run build``` command. All of npm related scripts
that you create should be placed here.

##### source/
This directory contains the source files for the site you will build.

##### source/data/
Put any data files you need for your site here, such as JSON files

##### source/img/
Put any images files for your site here. The directory structure you create inside this directory will be copied over when built

##### source/js/
Put any javascript files for your site here.  The directory structure you create insid ethis directory will be copied over when built

##### source/layouts/
Put your layout EJS Templete files here. Initially this directory will contain a ```default.ejs`` default layout.

##### source/pages/
Put your page EJS Templete files here.  Initially this directory will contain a ```index.ejs``` default page.

##### source/partials/
Put your partail EJS Templete files here.  Initially this directory will contain ```_footer.ejs```, ```_head.ejs```, ```_header.ejs```, and ```_scripts.ejs``` default partials

##### source/scss/
Put your SASS (.scss) files here.  This will be compiled to SCSS when the site is built. Any files beginning with an underscore (_) will not be compiled directly.


## How To use
You will build your site using [EJS Templetes](https://ejs.co/).  The default directory structure is setup so you have seperate places to put your partials, layouts, and actual pages.  Use the ```source/scss``` folder to create your [Sass files](https://sass-lang.com/).  Any Sass file that begins with an underscore (_) will not be compiled directly when the site is built, as it's assumed these are used in ```@import``` statements

Once you are ready to build the site, run the following command from the project root folder

```npm run build```

This will output the built site in the ```build/``` folder (see directory structure information above).

## The site.config.js File
In the project root folder, there is a file called ```site.config.js```.  This file contains the configuration infomration about your site, as well as configuration options used when building your site, namely the source directories and build directories used when the site is build.

Out of the box, the configuration is setup to use the default directory structure.  If you would prefer to use a different directory structure, you can edit the ```site.config.js``` **build:** values.  It is well commented, so refer to the comments for what values to use when editing.

**One thing to note. In ```site.config.js``` there is ```vendorSrcPath``` and ```vendorBuildPath```.  The default example shows how we get bootstrap and jQuery from the ```node_modules``` directory.  If you add or remove anything from this, be sure that the key names for ```vendorSrcPath``` and ```vendorBuildPath``` are exactly the same.  The ```build.js``` scripts just iterates over the key names from one and uses that as the reference to pull from the other, so it is important that they both contain the same keys with the same spelling and casing.**