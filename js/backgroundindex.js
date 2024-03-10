import Grid from 'grid';
import { map, lerp,clamp, calcWinsize,randomNumber, getRandomNumber, getMousePos, preloadImages, preloadFonts } from 'utils';
import 'locomotive-scroll';
// Preload  images
preloadImages('.grid__item-img, .bigimg').then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');
    
    // Initialize grid
    const grid = new Grid(document.querySelector('.grid'));
});

// Initialize Locomotive Scroll (horizontal direction)
const lscroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    direction: 'horizontal'
});

lscroll.on('scroll', (obj) => {
    for (const key of Object.keys(obj.currentElements)) {
        if ( obj.currentElements[key].el.classList.contains('gallery__item-imginner') ) {
            let progress = obj.currentElements[key].progress;
            const saturateVal = progress < 0.5 ? clamp(map(progress,0,0.5,0,1),0,1) : clamp(map(progress,0.5,1,1,0),0,1);
            const brightnessVal = progress < 0.5 ? clamp(map(progress,0,0.5,0,1),0,1) : clamp(map(progress,0.5,1,1,0),0,1);
            obj.currentElements[key].el.style.filter = `saturate(${saturateVal}) brightness(${brightnessVal})`
        }
    }
});
lscroll.update();
