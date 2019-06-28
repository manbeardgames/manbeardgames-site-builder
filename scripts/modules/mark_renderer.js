const path = require('path');
const marked = require('marked');
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['csharp']);


marked.setOptions({
    gfm: true
});



function render(content) {
    //  Create a new MarkDown renderer
    var renderer = new marked.Renderer();

    let sections = [];
    let current_section;
    let id_hash = [];

    //  Configure how to render the heading tag
    renderer.heading = function (text, level) {
        //  escapee the text so we're left with a spine value
        let escapted_text = text.toLowerCase().replace(/[^\w]+/g, '-');

        if(id_hash.indexOf(escapted_text) !== -1) {
            let i = 1;
            while(true) {
                let attempt = escapted_text + `-${i}`
                if(id_hash.indexOf(attempt) === -1) {
                    escapted_text = attempt;
                    break;
                }
                i = i + 1;
            }
        }

        id_hash.push(escapted_text);

        if (level === 1) {
            if (current_section != null) {
                sections.push(current_section);
            }

            current_section = {
                "name": text,
                "spine": escapted_text,
                "children": []
            };
        } else if (level === 2) {
            current_section.children.push({
                "name": text,
                "spine": escapted_text
            });
        }



        return `<h${level} id=${escapted_text}>${text}</h${level}>`
    }

    //  Configure how to render code tags
    renderer.code = function (code, language, is_escaped) {
        let html = prism.highlight(code, prism.languages.csharp, language);
        return `<pre class="language-${language}"><code class="language-${language}">${html}</code></pre>`;
    }

    //  Configure hwo to render image tags
    renderer.image = function (href, title, text) {
        let src = path.join('img', href);
        return `
        <div class="text-center">
        <img class="img-fluid border border-dark" src="\\${src}" alt="${title}" />
        </div>`;
    }

    //  Configure how to render link tags
    renderer.link = function (href, title, text) {
        let link = marked.Renderer.prototype.link.call(this, href, title, text);
        return link.replace('<a', '<a target="_blank"');
    }

    //  Configure hwo to render table tags
    renderer.table = function (header, body) {
        return `
        <table class="table">
        <thead class="thead-dark">${header}</thead>
        <tbody>${body}</tbody>
        </table>`;
    }

    //  Configure how to render blockquote tags
    renderer.blockquote = function (quote) {
        return `
        <div class="card text-white bg-dark mb-3">
        <div class="card-header">
        <span class="lead">Note:</span>
        </div>
        <div class="card-body">
        ${quote}
        </div>
        </div>`;
    }

    //  Render the markdown file contents as HTML
    let render = marked(content, {
        renderer: renderer
    });

    //  Return the reunder
    return Object.assign({}, {
        "html": render,
        "sections": sections
    });
}

module.exports.render = render;