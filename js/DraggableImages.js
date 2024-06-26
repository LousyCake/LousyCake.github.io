{
    const body = document.body;

    const MathUtils = {
        lineEq: (y2, y1, x2, x1, currentVal) => {
            // y = mx + b 
            var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
            return m * currentVal + b;
        },
        lerp: (a, b, n) => (1 - n) * a + n * b,
        getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
    };


    const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) 	{
            posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
        }
        return { x : posx, y : posy }
    };



    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    window.addEventListener('resize', calcWinsize);

    let mousepos = {x: winsize.width/2, y: winsize.height/2};
    window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));


    // Strip Item
    class StripItem {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.image = this.DOM.el.querySelector('.img-inner');
            this.DOM.number = this.DOM.el.querySelector('.strip__item-link');

            this.initEvents();
        }
        initEvents() {
            // Hovering the number makes it slide out/in
            this.DOM.number.addEventListener('mouseenter', () => {
                const inner = this.DOM.number.querySelector('span');
                new TimelineMax()
                .to(inner, 0.2, {
                    ease: Quad.easeOut,
                    y: '-100%',
                    opacity: 0
                }, 0)
                .to(inner, 0.5, {
                    ease: Expo.easeOut,
                    startAt: {y: '100%', opacity: 0, scale: 1.3},
                    y: '0%',
                    opacity: 1
                }, 0.2)
            });
            
            this.DOM.number.addEventListener('mouseleave', () => {
                const inner = this.DOM.number.querySelector('span');
                TweenMax.killTweensOf(inner);
                TweenMax.set(inner, {
                    scale: 1,
                    y: '0%',
                    opacity: 1
                });
            });
        }
    }


    // Images strip
    class Strip {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.strip = this.DOM.el.querySelector('.strip');
            this.items = [];
            [...this.DOM.strip.querySelectorAll('.strip__item')].forEach(item => this.items.push(new StripItem(item)));
            // The draggable container
            this.DOM.draggable = this.DOM.el.querySelector('.draggable');
            // the extra indicator element (scales down when we start dragging)
            this.DOM.indicator = document.querySelector('.frame__indicator');
            // the cover (name + year elements) that appear when we start to drag
            this.DOM.cover = this.DOM.el.querySelector('.strip-cover');
            // The width of the draggable container (also the strip container)
            this.draggableWidth = this.DOM.draggable.offsetWidth;
            // The total amount that we can drag the draggable container, so that both the first and last image stay next to the viewport boundary (left and right respectively)
            this.maxDrag = this.draggableWidth < winsize.width ? 0 : this.draggableWidth - winsize.width;
            // The current amount (in pixels) that was dragged
            this.dragPosition = 0;
            // Initialize the Draggabilly
            this.draggie = new Draggabilly(this.DOM.draggable, { axis: 'x' });

            this.init();
            this.initEvents();
        }
        init() {
            this.renderedStyles = {
                position: {previous: 0, current: this.dragPosition},
                scale: {previous: 1, current: 1},
                imgScale: {previous: 1, current: 1},
                opacity: {previous: 1, current: 1},
                coverScale: {previous: 0.75, current: 0.75},
                coverOpacity: {previous: 0, current: 0},
                indicatorScale: {previous: 1, current: 1},
            };

            this.render = () => {
                this.renderId = undefined;
                
                for (const key in this.renderedStyles ) {
                    this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, 0.1);
                }
                
                gsap.set(this.DOM.strip, {x: this.renderedStyles.position.previous});
                for (const item of this.items) {
                    gsap.set(item.DOM.el, {scale: this.renderedStyles.scale.previous, opacity: this.renderedStyles.opacity.previous});
                    gsap.set(item.DOM.image, {scale: this.renderedStyles.imgScale.previous});
                }
                gsap.set(this.DOM.cover, {scale: this.renderedStyles.coverScale.previous, opacity: this.renderedStyles.coverOpacity.previous});
                gsap.set(this.DOM.indicator, {scaleX: this.renderedStyles.indicatorScale.previous});

                if ( !this.renderId ) {
                    this.renderId = requestAnimationFrame(() => this.render());  
                }
            };
            this.renderId = requestAnimationFrame(() => this.render());
        }
        initEvents() {
            this.onDragStart = () => {
                this.renderedStyles.scale.current = 0.8;
                this.renderedStyles.imgScale.current = 1.6;
                this.renderedStyles.opacity.current = 0.3;
                this.renderedStyles.coverScale.current = 1;
                this.renderedStyles.coverOpacity.current = 1;
                this.renderedStyles.indicatorScale.current = 0;
            };

            this.onDragMove = (event, pointer, moveVector) => {
                // The possible range for the drag is draggie.position.x = [-maxDrag,0 ]
                if ( this.draggie.position.x >= 0 ) {
                    // the max we will be able to drag is winsize.width/2
                    this.dragPosition = MathUtils.lineEq(0.5*winsize.width,0, winsize.width, 0, this.draggie.position.x);
                }
                else if ( this.draggie.position.x < -1*this.maxDrag ) {
                    // the max we will be able to drag is winsize.width/2
                    this.dragPosition = MathUtils.lineEq(0.5*winsize.width,0, this.maxDrag+winsize.width, this.maxDrag, this.draggie.position.x);
                }
                else {
                    this.dragPosition = this.draggie.position.x;
                }
                this.renderedStyles.position.current = this.dragPosition;

                mousepos = getMousePos(event);
            };

            this.onDragEnd = () => {
                // reset draggable if out of bounds.
                if ( this.draggie.position.x > 0 ) {
                    this.dragPosition = 0;
                    this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
                }
                else if ( this.draggie.position.x < -1*this.maxDrag ) {
                    this.dragPosition = -1*this.maxDrag;
                    this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
                }
                this.renderedStyles.position.current = this.dragPosition;
                this.renderedStyles.scale.current = 1;
                this.renderedStyles.imgScale.current = 1;
                this.renderedStyles.opacity.current = 1;
                this.renderedStyles.coverScale.current = 0.75;
                this.renderedStyles.coverOpacity.current = 0;
                this.renderedStyles.indicatorScale.current = 1;

            };

            this.draggie.on('pointerDown', this.onDragStart);
            this.draggie.on('dragMove', this.onDragMove);
            this.draggie.on('pointerUp', this.onDragEnd);

            for (const item of this.items) {
                item.DOM.number.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    this.showItem(item);
                });
            }

            window.addEventListener('resize', () => {
                this.maxDrag = this.draggableWidth < winsize.width ? 0 : this.draggableWidth - winsize.width;
                if ( Math.abs(this.dragPosition) + winsize.width > this.draggableWidth ) {
                    const diff = Math.abs(this.dragPosition) + winsize.width - this.draggableWidth;
                    // reset dragPosition
                    this.dragPosition = this.dragPosition+diff;
                    this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
                }
            });
        }
    }

    // The images strip
    const strip = new Strip(document.querySelector('.strip-outer'));
    
}