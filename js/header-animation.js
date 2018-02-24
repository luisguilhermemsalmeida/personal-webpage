var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
function initParticles() {
    // Main
    initHeader();
    initAnimation();
    addListeners();
}

function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = {x: width/2, y: height/2};

    // largeHeader = document.getElementById('large-header');
    // largeHeader.style.height = height+'px';

    canvas = document.getElementById('demo-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create points
    points = [];
    for(var x = 0; x < width; x = x + width/20) {
        for(var y = 0; y < height; y = y + height/20) {
            var px = x + Math.random()*width/20;
            var py = y + Math.random()*height/20;
            var p = {x: px, originX: px, y: py, originY: py };
            points.push(p);
        }
    }

    // for each point find the 5 closest points
    for(var i = 0; i < points.length; i++) {
        var closest = [];
        var p1 = points[i];
        for(var j = 0; j < points.length; j++) {
            var p2 = points[j]
            if(!(p1 == p2)) {
                var placed = false;
                for(var k = 0; k < 5; k++) {
                    if(!placed) {
                        if(closest[k] == undefined) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }

                for(var k = 0; k < 5; k++) {
                    if(!placed) {
                        if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }
            }
        }
        p1.closest = closest;
    }

    // assign a circle to each point
    for(var i in points) {
        var c = new Circle(points[i], 3+Math.random()*2, 'rgba(255,255,255,0.3)');
        points[i].circle = c;
    }
}

// Event handling
function addListeners() {
    if(!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove);
    }
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
}

function mouseMove(e) {
    var posx = posy = 0;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = posx;
    target.y = posy;
}

function scrollCheck() {
    if(document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height+'px';
    canvas.width = width;
    canvas.height = height;
}

// animation
function initAnimation() {
    animate();
    for(var i in points) {
        shiftPoint(points[i]);
    }
}

function animate() {
    if(animateHeader) {
        ctx.clearRect(0,0,width,height);
        for(var i in points) {
            // detect points in range
            if(Math.abs(getDistance(target, points[i])) < 4000) {
                points[i].active = 0.3;
                points[i].circle.active = 0.6;
            } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                points[i].active = 0.1;
                points[i].circle.active = 0.3;
            } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                points[i].active = 0.02;
                points[i].circle.active = 0.1;
            } else {
                points[i].active = 0;
                points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
        }
    }
    requestAnimationFrame(animate);
}

function shiftPoint(p) {
    TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
        y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
        onComplete: function() {
            shiftPoint(p);
        }});
}

// Canvas manipulation
function drawLines(p) {
    if(!p.active) return;
    for(var i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = 'rgba(180,180,180,'+ p.active+')';
        ctx.stroke();
    }
}

function Circle(pos,rad,color) {
    var _this = this;

    // constructor
    (function() {
        _this.pos = pos || null;
        _this.radius = rad || null;
        _this.color = color || null;
    })();

    this.draw = function() {
        if(!_this.active) return;
        ctx.beginPath();
        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(180,180,180,'+ _this.active+')';
        ctx.fill();
    };
}

// Util
function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}
// particlesJS("intro-content", {
//     "particles": {
//         "number": {
//             "value": 80,
//             "density": {
//                 "enable": true,
//                 "value_area": 800
//             }
//         },
//         "color": {
//             "value": "#ffffff"
//         },
//         "shape": {
//             "type": "circle",
//             "stroke": {
//                 "width": 0,
//                 "color": "#000000"
//             },
//             "polygon": {
//                 "nb_sides": 5
//             }
//         },
//         "opacity": {
//             "value": 0.3,
//             "random": false,
//             "anim": {
//                 "enable": false,
//                 "speed": 1,
//                 "opacity_min": 0.1,
//                 "sync": false
//             }
//         },
//         "size": {
//             "value": 3,
//             "random": true,
//             "anim": {
//                 "enable": false,
//                 "speed": 40,
//                 "size_min": 0.1,
//                 "sync": false
//             }
//         },
//         "line_linked": {
//             "enable": true,
//             "distance": 180,
//             "color": "#ffffff",
//             "opacity": 0.4,
//             "width": 1
//         },
//         "move": {
//             "enable": true,
//             "speed": 5,
//             "direction": "none",
//             "random": false,
//             "straight": false,
//             "out_mode": "out",
//             "bounce": false,
//             "attract": {
//                 "enable": false,
//                 "rotateX": 600,
//                 "rotateY": 1200
//             }
//         }
//     },
//     "interactivity": {
//         "detect_on": "canvas",
//         "events": {
//             "onhover": {
//                 "enable": true,
//                 "mode": "grab"
//             },
//             "onclick": {
//                 "enable": true,
//                 "mode": "repulse"
//             },
//             "resize": true
//         },
//         "modes": {
//             "grab": {
//                 "distance": 140,
//                 "line_linked": {
//                     "opacity": 1
//                 }
//             },
//             "bubble": {
//                 "distance": 400,
//                 "size": 40,
//                 "duration": 2,
//                 "opacity": 8,
//                 "speed": 3
//             },
//             "repulse": {
//                 "distance": 200,
//                 "duration": 0.4
//             },
//             "push": {
//                 "particles_nb": 4
//             },
//             "remove": {
//                 "particles_nb": 2
//             }
//         }
//     },
//     "retina_detect": true
// });