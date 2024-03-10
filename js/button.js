// button.js

function toggleIcons() {
    var container = $('#social-container');
    container.toggleClass('expanded');
}

$(document).ready(function () {
    // Social media icons toggle button click handler
    $('#social-icon').on('click', function () {
        toggleIcons();
    });
});