(function () {

    let prev = document.getElementById('prev');
    let next = document.getElementById('next');

    let sections = document.getElementsByClassName('tutorial-section');
    let section_position = 0;

    Array.from(sections).forEach((section, i) => {
        section.style.display = 'none';
        section.classList.add('faster');
    });

    let nextParagraph = function (change) {
        //  Get the paragraph that is currently being displayed
        let current_paragraph = sections[section_position];

        //  Increment the section_position value by the change value given.
        //  looping it around the array index count if neccessary
        section_position = (section_position + change) % sections.length;
        if (section_position < 0) {
            section_position += sections.length;
        }

        //  Get the reference to the next paragraph to show
        let next_paragraph = sections[section_position];

        //  We now need to fade out the current paragraph. To do this, we'll remove
        //  the fade in animation it has, and replace it with the fade out animation
        current_paragraph.classList.remove('animated', 'fadeInRight');
        current_paragraph.classList.add('animated', 'fadeOutLeft');



        //  In the following function, we'll handle showing the next paragraph and 
        //  ensuring the current one that faded out stays hidden. This function
        //  will be called when the current paragraph's fade out animation ends
        function whenCurrentParagraphAnimationEnds() {
            //  First we're going to set the current paragraphs display to none
            //  to ensure it stays hidden
            current_paragraph.style.display = 'none';

            //  Next we'll remove any animations from it
            current_paragraph.classList.remove('animated', 'fadeOutLeft');

            //  Finally, we need to remove the event listener from it
            current_paragraph.removeEventListener('animationend', whenCurrentParagraphAnimationEnds);

            //  Next we need to add the fade in animation to th next paragraph
            next_paragraph.classList.add('animated', 'fadeInRight');

            //  We also need to set the display to initial so it is visible
            next_paragraph.style.display = null;
        }

        //  Now that we've defined the function above for hte current paragraph, 
        //  lets hook into it
        current_paragraph.addEventListener('animationend', whenCurrentParagraphAnimationEnds);
    }

    //  Bind to the click event for the previous button
    prev.addEventListener('click', function () {
        nextParagraph(-1);
    });

    //  Bind to the click event for the next button
    next.addEventListener('click', function () {
        nextParagraph(1);
    });

    //  Finally, we need to animate in the very first section
    sections[0].classList.add('animated', 'fadeInRight');
    sections[0].style.display = null;

})();

$(document).ready(function() {
    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
});