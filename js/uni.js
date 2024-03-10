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

