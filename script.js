const canvas = document.getElementById(`canvas1`);
const ctx = canvas.getContext(`2d`);
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let particleArray = [];
const colors = [
    `rgba(0, 255, 231)`,
    `rgba(255, 100, 255, 0.3)`,
    `rgba(173, 216, 230, 0.8)`,
    `rgba(241, 211, 241, 0.8)`
];
const maxSize = 40;
const minSize = 0;
//number of pixels around mouse
const mouseRadius = 60;

// position of mouse
let mouse = {
    x: null,
    y: null
};
window.addEventListener('mousemove',
function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    console.log(mouse);
    }
)
// constructor function for particle to create multiple objects of same type
function Particle(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
}
// add draw method to particle prototype
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
}
// add update method to particle prototype
Particle.prototype.update = function() {
    if (this.x + this.size*2 > canvas.width ||
        this.x - this.size*2 < 0) {
            this.directionX = -this.directionX;
    } 
    if (this.y + this.size*2 > canvas.width ||
        this.y - this.size*2 < 0) {
            this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;
        
    //mouse interactivity
    if (    mouse.x - this.x < mouseRadius
        &&  mouse.x - this.x > -mouseRadius
        &&  mouse.y - this.y < mouseRadius
        &&  mouse.y - this.y > -mouseRadius) {
            if (this.size < maxSize) {
                this.size += 4;
            }
        } else if (this.size - 0.1 >= minSize) {
            this.size -= 0.1; 
        }
        if (this.size < 0) {
            this.size = 0;
        }
        this.draw();
}
//create particle array
function init() {
    particleArray = [];
    for (let i = 0; i <1000; i++) {
        let size = 0;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * .2) - .1;
        let directionY = (Math.random() * .2) - .1;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particleArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}
// animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
    }
}
init();
animate();

//resize event: update canvas size and redistibute particles in the new available space when user resizes the window
window.addEventListener(`resize`,
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
)
//remove mouse postition periodically: to make sure the particles don't stay in corner if mouse leaves canvas
setInterval(function() {
    mouse.x = undefined;
    mouse.y = undefined;
}, 1000);