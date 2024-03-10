console.log('about.js is loaded.');

document.addEventListener('DOMContentLoaded', function () {
    var barContainer = document.getElementById("barContainer");
    var soContainer = document.getElementById("soContainer");
    var containers = [barContainer, soContainer];
    var currentIndex = 0;

    // Display the first container on page load
    containers[currentIndex].classList.add('active');

    // Attach the toggleContainers function to the buttons
    document.querySelector(".left-button").addEventListener("click", toggleContainers);
    document.querySelector(".right-button").addEventListener("click", toggleContainers);

    function toggleContainers() {
        containers[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % containers.length; // Cycle through containers
        containers[currentIndex].classList.add('active');
    }

    function adjustCursor(e) {
        const cursor = document.querySelector('.cursor');
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }

    document.addEventListener('mousemove', adjustCursor);

    $('[data-invert-on-hover]').hover(
        function () {
            const cursor = document.querySelector('.cursor');
            cursor.style.opacity = 0.5;
        },
        function () {
            const cursor = document.querySelector('.cursor');
            cursor.style.opacity = 1;
        }
    );
});
