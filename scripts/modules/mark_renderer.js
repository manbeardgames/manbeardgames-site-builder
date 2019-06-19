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

    //  Configure how to render the heading tag
    renderer.heading = function (text, level) {
        let escapted_text = text.toLowerCase().replace(/[^\w]+/g, '-');
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
    return render;
}

module.exports.render = render;