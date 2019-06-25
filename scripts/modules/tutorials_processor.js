const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const log = require('./logger');
const { config } = require('../../source/data/tutorial_config');
const mark_renderer = require('./mark_renderer');


//  ===================================================================================
/**
 * Processes the tutorials located in ./source/tutorials, renders them and
 * outputs them to ./public/tutorials
 */
//  ===================================================================================
function process() {
    log.log('Processing Tutorials');

    //  First read the tutorial configuration file contents
    //let tutorail_config_contents = fse.readFileSync('./source/tutorials/config.json', 'utf-8');

    //  Next convert the tutorial config contents into a JSON object
    // let tutorial_config = JSON.parse(tutorail_config_contents);

    //  Itereate each of the tutorials in the config
    config.tutorials.forEach((tutorial, i) => {
        let sections = [];
        let sidebar_sections = [];

        //  Itereate the sections of the tutorial
        tutorial.sections.forEach((section, i) => {
            //  Read the contents of the tutorial section file
            let content = fse.readFileSync(path.join('./source/tutorials', tutorial.spine, section.spine + '.md'), 'utf-8');

            //  Render the content using the markdown renderer
            let render = mark_renderer.render(content);

            //  Put the rendered section in the sections array
            sections.push(render);

            //  Create the object to push into sidebar sections array
            let sidebar_section = {
                name: section.name,
                spine: section.spine,
                index: i
            };
            sidebar_sections.push(sidebar_section);

        });

        //  Now that each section of the tutorial has been rendered, we 
        //  need to render the tutorial wrapper partial using the sections
        //  First create a string with the path to the wrapper tempalte
        let wrapper_file_name = './source/partials/tutorials/_tutorial_wrapper.ejs';

        //  Next read the contents of the file
        let wrapper_contents = fse.readFileSync(wrapper_file_name, 'utf-8');

        //  Now render the wrapper
        let wrapper_render = ejs.render(
            wrapper_contents,
            Object.assign({}, {
                sections: sections
            })
        );

        //  Now that we've rendered the wrapper with all of it's sections
        //  we next need to render the sidebar
        //  First create a string witht he path to the sidebar tempalte
        let side_bar_file_name = './source/partials/tutorials/_tutorial_sidebar.ejs';

        //  Next read the contents of the file
        let sidebar_contents = fse.readFileSync(side_bar_file_name, 'utf-8');

        //  Now render the sidebar
        let sidebar_render = ejs.render(
            sidebar_contents,
            Object.assign({}, {
                heading: tutorial.name,
                sections: sidebar_sections
            })
        );

        //  The last step is to render the tutorial page layout
        //  First, create a string with the path to the tutorial page layout
        let tutorial_layout_filename = './source/layouts/tutorials.ejs';

        //  Next read the contents of the layout file
        let tutorial_layout_contents = fse.readFileSync(tutorial_layout_filename, 'utf-8');

        //  And finally render it
        let final_render = ejs.render(
            tutorial_layout_contents,
            Object.assign({}, {
                "tutorial_name": tutorial.name,
                "sidebar": sidebar_render,
                "tutorial": wrapper_render,
                page: {
                    "title": tutorial.name,
                    "description": tutorial.description,
                    "ogtitle": tutorial.opengraph.title,
                    "ogimage": tutorial.opengraph.image,
                    "ogdescription": tutorial.opengraph.description
                },
                filename: tutorial_layout_filename
            }),

        );

        //  Let's ensure that we have the output directory created
        fse.ensureDirSync(path.join('./public/tutorials', tutorial.spine));

        //  And save the final render to disk as the HTML file it is
        fse.writeFileSync(path.join('./public/tutorials', tutorial.spine, 'index.html'), final_render);
    });
}



function process_old() {
    log.log('Processing Tutorials');

    //  First we need to read the contents fo the tutorial config JSON file
    let tutorial_config_json = fse.readFileSync('./source/tutorials/config.json', 'utf-8');

    //  Next we parse the JSON into an object htat we can work with
    let tutorial_config = JSON.parse(tutorial_config_json);

    //  Next we process all of the tutorials in the config
    tutorial_config.tutorials.forEach((tutorial, i) => {
        log.log(`Processing ${tutorial.title} (${i + 1} of ${tutorial_config.tutorials.length})`, {
            indent: 1
        });

        //  Check to see first if the tutorial is marked as a series
        if (tutorial.is_series) {
            log.log(`${tutorial.title} is a series, processing as series`, {
                indent: 2
            });

            //  Since it is a series, then we need to process first the individual tutorials
            //  in the series, then process an index page for the series itself
            tutorial.tutorials.forEach((sub_tutorial, i) => {
                log.log(`Processing ${sub_tutorial.title} (${i + 1} of ${tutorial.tutorials.length})`, {
                    indent: 3
                });

                //  Read the contents of the file associated with the sub tutorial
                let file_content = fse.readFileSync(path.join(sub_tutorial.source_dir, sub_tutorial.file_name + sub_tutorial.file_ext), 'utf-8');

                //  Render the contents using a marked renderer
                let render = mark_renderer.render(file_content);

                //  Generate the filename fo the layout to use based on the layout config for the sub tutorial
                let layout_file_name = path.join('./source/layouts', sub_tutorial.layout + '.ejs');

                //  Read the contents of the layout file
                let layout_file_contents = fse.readFileSync(layout_file_name, 'utf-8');

                //  Performt he final render of the sub tutorial
                let final_render = ejs.render(
                    layout_file_contents,
                    Object.assign({}, {
                        page: {
                            "title": sub_tutorial.title,
                            "description": sub_tutorial.short,
                            "ogtitle": sub_tutorial.opengraph.title,
                            "ogimage": sub_tutorial.opengraph.image,
                            'ogdescription': sub_tutorial.opengraph.description
                        },
                        body: render,
                        filename: layout_file_name
                    })
                );

                //  Ensure the directory to output the sub tutorial final render exists
                fse.ensureDirSync(sub_tutorial.output_dir);

                //  Write the final render to disk as HTML
                fse.writeFileSync(path.join(sub_tutorial.output_dir, 'index.html'), final_render);
            })

            //  Now use the _series_index partial to render the index page for the series
            let partial_content = fse.readFileSync('./source/partials/tutorials/_series_index.ejs', 'utf-8');

            //  Render the partial
            let partial_render = ejs.render(
                partial_content,
                Object.assign({}, {
                    series_name: tutorial.title,
                    series_description: tutorial.short,
                    tutorials: tutorial.tutorials,
                    filename: './source/partials/tutorials/_series_index.ejs'
                })
            );

            //  Generate path to the layout
            let layout_file_path = path.join('./source/layouts', tutorial.layout + '.ejs');

            //  Read the contents of the layout file
            let layout_file_contents = fse.readFileSync(layout_file_path, 'utf-8');

            //  Render using the layout
            let series_render = ejs.render(
                layout_file_contents,
                Object.assign({}, {
                    page: {
                        "title": tutorial.title,
                        "description": tutorial.description,
                        "ogtitle": tutorial.opengraph.title,
                        "ogimage": tutorial.opengraph.image,
                        "ogdescription": tutorial.opengraph.description
                    },
                    body: partial_render,
                    filename: layout_file_path
                })
            );

            //  Ensure the output directory exists
            fse.ensureDirSync(path.join('./public/tutorials', ));

            //  Write the series render to disk as HTMl
            fse.writeFileSync(path.join(tutorial.output_dir, 'index.html'), series_render);
        } else {
            //  Read the contents of the tutorial file associated with this tutorial
            let file_content = fse.readFileSync(path.join(tutorial.source_dir, tutorial.file_name + tutorial.file_ext), 'utf-8');

            //  Render the file contents using a marked renderer
            let render = mark_renderer.render(file_content);

            //  Genereate the filename of the layou tot use baed on the layout config for the tutorial
            let layout_file_name = path.join('./source/layouts', tutorial.layout + '.ejs');

            //  Read the contents of the layout file
            let layout_file_contents = fse.readFileSync(layout_file_name, 'utf-8');

            //  Render using the layout
            let final_render = ejs.render(
                layout_file_contents,
                Object.assign({}, {
                    page: {
                        "title": tutorial.title,
                        "description": tutorial.short,
                        "ogtitle": tutorial.opengraph.title,
                        "ogimage": tutorial.opengraph.image,
                        "ogdescription": tutorial.opengraph.description
                    },
                    body: render,
                    filename: layout_file_name
                })
            );

            //  Ensure the directory to output to exists
            fse.ensureDirSync(tutorial.output_dir);

            //  Write the final render to disk as HTML
            fse.writeFileSync(path.join(tutorial.output_dir, 'index.html'), final_render);
        }
    })

    //  The main tutorial page uses the same _series_index partial as the other series pages
    let partial_content = fse.readFileSync('./source/partials/tutorials/_series_index.ejs', 'utf-8');

    //  Render the partial
    let partial_render = ejs.render(
        partial_content,
        Object.assign({}, {
            series_name: tutorial_config.title,
            series_description: tutorial_config.short,
            tutorials: tutorial_config.tutorials,
            filename: './source/partials/tutorials/_series_index.ejs'
        })
    );

    //  Generate the filename of the layout to use based ont he layout config
    let layout_file_name = path.join('./source/layouts', tutorial_config.layout + '.ejs');

    //  Read the contents of the layout file
    let layout_file_content = fse.readFileSync(layout_file_name, 'utf-8');

    //  Perform the final render using ejs
    let final_render = ejs.render(
        layout_file_content,
        Object.assign({}, {
            page: {
                "title": tutorial_config.title,
                "description": tutorial_config.description,
                "ogtitle": tutorial_config.opengraph.title,
                "ogimage": tutorial_config.opengraph.image,
                "ogdescription": tutorial_config.opengraph.description
            },
            body: partial_render,
            filename: layout_file_name
        })
    );

    //  Ensure the directory to output to exists
    fse.ensureDirSync(tutorial_config.output_dir);

    //  Write the final render to disk as HTML
    fse.writeFileSync(path.join(tutorial_config.output_dir, 'index.html'), final_render);
}

module.exports.process = process;