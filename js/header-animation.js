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

    canvas = document.getElementById('demo-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    // create points
    var ratio = width/height;
    var numberOfColumns = width/64;
    var numberOfRows = height/100 * (ratio + 1);
    points = [];
    var columnSize = width/numberOfColumns;
    var rowSize = height/numberOfRows;
    for (var column = 0; column < numberOfColumns; column++) {
        for (var row = 0; row < numberOfRows; row++) {
            var pointX = (columnSize * column) + (Math.random() * columnSize);
            var pointY = (rowSize * row) + (Math.random() * rowSize);
            var point = {originX: pointX, originY: pointY, x: pointX, y: pointY};
            points.push(point);
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
    for(var index in points) {
        points[index].circle = new Circle(points[index], 3 + Math.random() * 2, 'rgba(255,255,255,0.3)');
    }
}

function mouseclick(e) {
    var newTargetPositionX = 0;
    var newTargetPositionY = 0;
    if (e.pageX || e.pageY) {
        newTargetPositionX = e.pageX;
        newTargetPositionY = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        newTargetPositionX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        newTargetPositionY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var currentX = target.x;
    var currentY = target.y;

    var animationIterationsX = Math.abs(currentX - newTargetPositionX);
    var animationIterationsY =  Math.abs(currentY - newTargetPositionY);
    var directionX = (newTargetPositionX - currentX)/Math.abs(newTargetPositionX - currentX);
    var directionY = (newTargetPositionY - currentY)/Math.abs(newTargetPositionY - currentY);
    for (var animationX = 0; animationX < animationIterationsX; animationX++) {
        setTimeout(function () {
            target.x += directionX;
        }, 2*animationX);
    }
    for (var animationY = 0; animationY < animationIterationsY; animationY++) {
        setTimeout(function () {
            target.y += directionY;
        }, 2*animationY);
    }
}

// Event handling
function addListeners() {
    if(!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove);
    } else {
        window.addEventListener('click', mouseclick);
    }
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
}

function mouseMove(e) {
    var newTargetPositionX = 0;
    var newTargetPositionY = 0;
    if (e.pageX || e.pageY) {
        newTargetPositionX = e.pageX;
        newTargetPositionY = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        newTargetPositionX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        newTargetPositionY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = newTargetPositionX;
    target.y = newTargetPositionY;
}

function scrollCheck() {
    animateHeader = document.body.scrollTop <= height;
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