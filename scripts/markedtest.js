const marked = require('marked');
const prism = require('prismjs');
var loadLanguages = require('prismjs/components/');
loadLanguages(['csharp']);

let md = '<pre><code class="language-csharep">private int something = 0;</code></pre>';

var markedRenderer = new marked.Renderer();
markedRenderer.code = function (code, language, isEscapsed) {
    var html = prism.highlight(code, prism.languages.csharp, language);
    console.log('-------');
    console.log(html);
    console.log('-------');
    return html;
}

let result = marked(md, { renderer: markedRenderer });
console.log(result);



//-------------------------------------------------------------------------------------------
// const marked = require('marked');
// GenerateTutorials();




// function GenerateTutorials() {

//     let md = '```csharp \n private int something = 0; \n ```';


//     //  Render the marked
//     var markedRenderer = new marked.Renderer();
//     markedRenderer.heading = function (text, level) {
//         var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
//         return `
//             <h${level} id=${escapedText}>${text}</h${level}>`;
//     }

//     markedRenderer.code = function (code, language, isEscapsed) {
//         return `
//             <pre><code asdfasdfasd class="${language}">${code}</code></pre>`

//     }
//     let renderedPost = marked(md, { renderer: markedRenderer });

//     console.log(renderedPost);
// }

