var _panes,
    _stackWidth;

function run(paneElements, container) {
    document.addEventListener('touchmove', function(ev) {
        ev.preventDefault();
    });

    var i;

    _panes = [];
    for (i = 0; i < paneElements.length; i++) {
        var isBase = (i == 0);
        _panes[i] = new Pane(paneElements[i], isBase);
    }

    _stackWidth = container.offsetWidth;
    window.addEventListener('resize', function(ev) {
        _stackWidth = container.offsetWidth;
        if (_panes.length > 1) {
            var lastPane = _panes[_panes.length-1];

            lastPane.setX(_stackWidth - lastPane.getWidth());
        }
    });

    // Start updating
    updateStack();
}

function updateStack() {
    var i, len, shade, maxRight;


    len = _panes.length;
    for (i=0; i<len; i++) {
        _panes[i].update();
    }

    i=len;
    shade = 0.0;
    maxRight = _stackWidth;
    while (i-->0) {
        var section = _panes[i],
            sectionX = section.getX(),
            sectionWidth = section.getWidth();

        if (i > 0) {
            if (sectionX < (maxRight - sectionWidth)) {
                section.setX(maxRight - sectionWidth);
            }
            else if (sectionX > (maxRight - 30)) {
                section.setX(maxRight - 30);
            }
            else if (maxRight > 30 && sectionX < 0) {
                section.setX(0);
            }
        }

        shade -= 0.15 * (maxRight-sectionX)/sectionWidth;
        if (shade < 0)
            shade = 0;

        section.setShade(shade);

        shade += 0.2;
        maxRight = sectionX;
    }

    requestAnimationFrame(updateStack);
}



function Pane(domElement, isBase) {
    this.domElement = domElement;
    this.contentElement = domElement.getElementsByClassName('section-pane-content')[0];
    this.shaderElement = document.createElement('div');
    this.shaderElement.className = 'section-pane-shader';
    this.domElement.appendChild(this.shaderElement);
    this.dragging = false;
    this.isBase = isBase;

    var startX, startY,
        originalX, originalY,
        dragging = false,
        section = this,
        prevX, speedX,
        prevY, speedY,
        axis;

    var x = 0;
    this.getX = function() {
        return x;
    }
    this.setX = function(val) {
        x = val;
        this.domElement.style.transform = 'translate3d('+x+'px,0,0)';
        this.domElement.style.webkitTransform = 'translate3d('+x+'px,0,0)';
    }

    var shade = 0;
    this.getShade = function() {
        return shade;
    }
    this.setShade = function(val) {
        shade = Math.max(0.0, Math.min(val, 1.0));
        this.shaderElement.style.backgroundColor = 'rgba(0,0,0,'+shade+')';
    }


    var w = this.domElement.offsetWidth;
    this.getWidth = function() {
        return w;
    }

    var scroll = 0;
    this.getScroll = function() {
        return scroll;
    }
    this.setScroll = function(val) {
        val = Math.min(0, Math.max(val,
                this.domElement.offsetHeight - this.contentElement.offsetHeight - 200));
        scroll = val;
        this.contentElement.style.transform = 'translate3d(0,'+scroll+'px,0)';
        this.contentElement.style.webkitTransform = 'translate3d(0,'+scroll+'px,0)';
    }


    function startDragging(data) {
        axis = null;
        dragging = true;
        startX = data.pageX;
        startY = data.pageY;
        prevX = startX;
        prevY = startY;
        speedX = 0;
        speedY = 0;
        originalX = section.getX();
        originalY = section.getScroll();
    }

    function stopDragging() {
        dragging = false;
    }

    this.domElement.addEventListener('mousewheel', function(ev) {
        section.setScroll(section.getScroll() + ev.wheelDeltaY/2);
    });

    this.domElement.addEventListener('touchstart', function(ev) {
        if (!section.isBase) {
            startDragging(ev.touches[0]);
        }
    });

    this.domElement.addEventListener('mousedown', function(ev) {
        if (!section.isBase && ev.pageY < 160) {
            startDragging(ev);
            ev.preventDefault();
            ev.stopImmediatePropagation();
        }
    });

    this.domElement.addEventListener('mousemove', function(ev) {
        if (dragging) {
            section.setX(originalX + (ev.pageX - startX));
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
        }
    });

    this.domElement.addEventListener('touchmove', function(ev) {
        if (dragging) {
            var touch = ev.changedTouches[0],
                dx = touch.pageX - startX,
                dy = touch.pageY - startY,
                tmpAxis = null;

            tmpAxis = axis || ((dx*dx > dy*dy)? 'x' : 'y');

            if (!axis && (dx*dx+dy*dy) > 400) {
                axis = tmpAxis;
            }

            if (tmpAxis=='x') {
                speedX = (originalX + dx) - section.getX();
            }
            else if (tmpAxis=='y') {
                speedY = (originalY + dy) - section.getScroll();
            }
        }
    });

    document.addEventListener('touchend', function(ev) {
        stopDragging();
    });

    document.addEventListener('mouseup', function(ev) {
        stopDragging();
    });

    this.update = function() {
        if (speedY*speedY > 0.01) {
            section.setScroll(section.getScroll() + speedY);
            speedY *= 0.95;
        }
        if (speedX*speedX > 0.01) {
            section.setX(section.getX() + speedX);
            speedX *= 0.8;
        }
    }
}

export default {
    run: run
};
