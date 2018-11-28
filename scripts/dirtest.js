var fse = require('fs-extra');
var glob = require('glob');
var path = require('path');
var paths = require('../paths');


//  Get a list of all the tutorial files
let tutorialFiles = glob.sync('**/*.md', { cwd: paths.source.tutorials });
//let directories = []

let headers = [];
tutorialFiles.forEach((tutorial, i) => {
    //  Get the file info of the tutorial file
    let fileInfo = path.parse(tutorial);
    //  Add the directory fo the file to the headers array
    //directories.push(fileInfo.dir);
    headers.push({ name: fileInfo.dir, subHeaders: [] });
});



//-------------
//  Filter the headers so that it only contains the unique values
headers = headers.filter((value, index, self) => {
    return index === self.findIndex((h) => h.name === value.name);
});

//  Add all files into the subheader collection of the appropriate header
tutorialFiles.forEach((tutorial, i) => {
    let fileInfo = path.parse(tutorial);
    let idx = headers.findIndex(x => x.name === fileInfo.dir);
    headers[idx].subHeaders.push({ name: fileInfo.name });
});

//  Sort the headers by name
headers.sort((a, b) => {
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    } else {
        return 0;
    }
});

//  Sort each subheader by name
let idx = 0;
for (idx = 0; idx < headers.length; idx++) {
    headers[idx].subHeaders.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    });
};

//  Sanatize the names of all headers and subheaders so that
//  the numbers are removed and they are in title case
headers.forEach((header, i) => {
    header.name = header.name.replace(/[0-9]+-/g, '');
    header.name = header.name.split('-').join(' ');
    header.name = header.name
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    header.subHeaders.forEach((subHeader, i) => {
        subHeader.name = subHeader.name.replace(/[0-9]+-/g, '');
        subHeader.name = subHeader.name.split('-').join(' ');
        subHeader.name = subHeader.name
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    });
})
//-------------

let i = 0;
let j = 0;
for(i = 0; i < headers.length; i++) {
    console.log(headers[i].name);
    for(j = 0; j < headers[i].subHeaders.length; j++) {
        console.log('    ' + headers[i].subHeaders[j].name);
    }
}