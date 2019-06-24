(function () {

    let prev = document.getElementById('prev');
    let next = document.getElementById('next');

    let sections = document.getElementsByClassName('tutorial-section');
    let section_navs = document.getElementsByClassName('section-nav');
    let section_position = 0;

    Array.from(sections).forEach((section, i) => {
        section.style.display = 'none';
        section.classList.add('faster');
    });

    let nextParagraph = function (change, exact) {
        //  Get the paragraph that is currently being displayed
        let current_paragraph = sections[section_position];

        //  Get the section nav that is the current active one
        let current_section_nav = section_navs[section_position];

        //  Calcualte to determien the direction of animation is done here
        //  since after this we have to change the value of section_position
        //  but we need it unchanged to determine the animation direction
        let animation_direction = -1;
        if ((!exact && change > 0) || (exact && change > section_position)) {
            animation_direction = 1;
        }

        //  If we're not using exact positioning then we need to calcualte the
        //  next section position
        if (!exact) {
            //  Increment the section_position value by the change value given.
            //  looping it around the array index count if neccessary
            section_position = (section_position + change) % sections.length;
            if (section_position < 0) {
                section_position += sections.length;
            }
        } else {
            //  Otherwise we just use the change given as the exact position
            section_position = change;
        }

        //  Get the reference to the next paragraph to show
        let next_paragraph = sections[section_position];

        //  Do not continue if we are not actually changing paragraphs. This occurs if the
        //  user clicks the paragraph section that is already hightlighted in the sidebar
        if (current_paragraph === next_paragraph) {
            return;
        }

        //  If the section_position is 0, disable the previous button
        if(section_position === 0) {
            prev.disabled = true;
            prev.classList.remove('btn-primary');
            prev.classList.add('btn-secondary');
        } else if(section_position == sections.length - 1) {
            next.disabled = true;
            next.classList.remove('btn-primary');
            next.classList.add('btn-secondary');
        } else {
            prev.disabled = false;
            prev.classList.remove('btn-secondary');
            prev.classList.add('btn-primary');
            next.disabled = false;
            next.classList.remove('btn-secondary');
            next.classList.add('btn-primary');
        }

        //  Get the reference to the next section nav that needs to be the active one
        let next_section_nav = section_navs[section_position];

        //  We now need to fade out the current paragraph. To do this, we'll remove
        //  the fade in animation it has, and replace it with the fade out animation
        current_paragraph.classList.remove('animated', 'fadeInRight', 'fadeInLeft');

        //  Determien the correction aniamtion to add based on the animation direction
        //  calculated previously
        if (animation_direction > 0) {
            current_paragraph.classList.add('animated', 'fadeOutLeft');
        } else {
            current_paragraph.classList.add('animated', 'fadeOutRight');
        }

        //  Next we need to set the current section nav as no longer active and
        //  the new one as active
        current_section_nav.classList.remove('active');
        next_section_nav.classList.add('active');




        //  In the following function, we'll handle showing the next paragraph and 
        //  ensuring the current one that faded out stays hidden. This function
        //  will be called when the current paragraph's fade out animation ends
        function whenCurrentParagraphAnimationEnds() {
            //  First we're going to set the current paragraphs display to none
            //  to ensure it stays hidden
            current_paragraph.style.display = 'none';

            //  Next we'll remove any animations from it
            current_paragraph.classList.remove('animated', 'fadeOutLeft', 'fadeOutRight');

            //  Finally, we need to remove the event listener from it
            current_paragraph.removeEventListener('animationend', whenCurrentParagraphAnimationEnds);

            //  Next we need to add the fade in animation to th next paragraph
            if (animation_direction > 0) {
                next_paragraph.classList.add('animated', 'fadeInRight');
            } else {
                next_paragraph.classList.add('animated', 'fadeInLeft');
            }

            //  We also need to set the display to initial so it is visible
            next_paragraph.style.display = null;
        }

        //  Now that we've defined the function above for hte current paragraph, 
        //  lets hook into it
        current_paragraph.addEventListener('animationend', whenCurrentParagraphAnimationEnds);
    }

    

    //  Bind to the click event for the previous button
    prev.addEventListener('click', function () {
        nextParagraph(-1, false);
    });

    //  Bind to the click event for the next button
    next.addEventListener('click', function () {
        nextParagraph(1, false);
    });

    //  Go through each of the section navs and add a new click function to them
    Array.from(section_navs).forEach((nav, i) => {
        //  Bind to the blick event fo the nav
        nav.addEventListener('click', function () {
            //  We also need to ensure that we close the sidebar if it's 'active' 
            //  from a mobile view
            let off_canvas = document.getElementsByClassName('row-offcanvas')[0]
            if (off_canvas.classList.contains('active')) {
                off_canvas.classList.remove('active');
            }

            //  First we need to get the position of the nav
            let nav_position = parseInt(this.dataset.position);

            //  Next call the nextParagraph  function exact position
            nextParagraph(nav_position, true);

        });
    });

    //  Finally, we need to animate in the very first section
    sections[0].classList.add('animated', 'fadeInRight');
    sections[0].style.display = null;
    prev.classList.remove('btn-primary');
    prev.classList.add('btn-secondary');


})();

$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});