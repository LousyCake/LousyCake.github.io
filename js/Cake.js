$(document).ready(function () {
    // Function to toggle between light and dark mode
    function toggleTheme() {
        $('body').toggleClass('light-mode'); // Toggle light mode class


        if ($('body').hasClass('light-mode')) {
            $('#theme-toggle-button .moon-icon').show();
            $('#theme-toggle-button .sun-icon').hide();
        }
        else {
            $('#theme-toggle-button .moon-icon').hide();
            $('#theme-toggle-button .sun-icon').show();
        }



        // Toggle the CSS file for the theme
        const cssLink = $('#theme-stylesheet');
        if (cssLink.attr('href') === 'Cake.css') {
            cssLink.attr('href', 'CakeLight.css');
        } else {
            cssLink.attr('href', 'Cake.css');
        }
    }

    // Select the circular cursor element using jQuery
    const cursor = $('.cursor');

    // Function to adjust cursor size and position
    function adjustCursor(e) {
        // Adjust the cursor's position based on mouse coordinates
        cursor.css({
            left: e.clientX + 'px',
            top: e.clientY + 'px',
        });
    }

    // Handle cursor position and color inversion
    $(document).on('mousemove', adjustCursor);

    $("#embedtag").contents().find("body").mousemove(adjustCursor);

    $('[data-invert-on-hover]').hover(
        // Mouseenter handler
        function () {
            cursor.css('filter', 'invert(100%)'); // Invert colors when hovering over the element
        },
        // Mouseleave handler
        function () {
            cursor.css('filter', 'none'); // Reset to normal colors when leaving the element
        }
    );

    // Apply invert filter to elements inside cursor
    cursor.on('mouseenter', function () {
        $(this).find('*').css('filter', 'invert(100%)');
    });

    cursor.on('mouseleave', function () {
        $(this).find('*').css('filter', 'none');
    });

    // Theme toggle button click handler
    $('#theme-toggle-button').on('click', function () {
        toggleTheme();
    });

});
