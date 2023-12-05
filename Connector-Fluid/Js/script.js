/******************************************************************************
 * @author Jake Brockbank
 * Dec 5th, 2023 (Original)
 * Canvas Setup:
 *   - The canvas (canvas1) is retrieved from the DOM and its 2D context 
 *     (ctx) is obtained.
 *   - The canvas size is set to the full window dimensions.
 *   - A particlesArray is created to store particle objects.
 *   - A hue variable is initialized for color control.
 * - Window Resize Listener:
 *   - An event listener is added to the window to adjust the canvas size 
 *     whenever the window is resized, ensuring the canvas always fills 
 *     the entire window.
 * - Mouse Object:
 *   - A mouse object is declared to track the mouse's x and y coordinates, 
 *     initially set to undefined.
 * - Canvas Click and Mousemove Listeners:
 *   - Event listeners are added to the canvas for click and mousemove 
 *     events.
 *   - When the canvas is clicked or the mouse moves over it, the mouse 
 *     object is updated with the current mouse position.
 *   - On each click, 2 new Particle objects are added to particlesArray.
 *   - On each mousemove, 5 new Particle objects are added.
 * - Particle Color Control:
 *   - The getID function changes the color of newly created particles 
 *     based on the clicked button ID (color1 or color2).
 * - Particle Class:
 *   - A Particle class is defined to create particle objects with 
 *     properties like position (x, y), size, speed, and color.
 *   - The update method updates the particle's position and gradually 
 *     decreases its size.
 *   - The draw method draws a hexagon at the particle's position with 
 *     the specified color.
 * - Particle Handling:
 *   - handleParticles function iterates through the particlesArray, 
 *     updating and drawing each particle.
 *   - It also checks the distance between each pair of particles. 
 *     If the distance is less than 100 pixels, it draws a line between 
 *     them, with line width based on the distance.
 *   - Particles with size less than or equal to 0.3 are removed from 
 *     the array to avoid unnecessary processing.
 * - Animation Loop:
 *   - The animate function clears the canvas and calls handleParticles 
 *     to update and draw the particles.
 *   - The hue value is incremented to change colors over time.
 *   - requestAnimationFrame(animate) creates a smooth animation loop.
******************************************************************************/

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
let hue = 0;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined,
}

canvas.addEventListener('click', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 2; i++) 
    {
        particlesArray.push(new Particle());
    }
});

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 5; i++) 
    {
        particlesArray.push(new Particle());
    }
})

/******************************************************************************
 * Method: getID: 
 * 
 * - This method changes the color of newly created particles based on the
 *  clicked button ID (color1 or color2).
 *
 * Input: clicked_id.
 *
 * Output: None.
 *
******************************************************************************/
function getID(clicked_id) 
{
    if(clicked_id == 'color1') 
    {
        var color1 = 1;
        let particle = new Particle(color1);
    } 
    else if (clicked_id == 'color2') 
    {
        var color2 = 2;
        let particle = new Particle(color2);
    }
}

/******************************************************************************
 * Class: Particle: 
 * 
 * - Constructor:
 *   - The constructor is called when a new instance of Particle is created.
 *   - this.x and this.y are set to the current mouse position 
 *     (mouse.x and mouse.y), meaning each particle is initially placed 
 *     where the mouse is.
 *   - this.size is randomly set between 1 and 16 (inclusive), determining 
 *     the size of the particle.
 *   - this.speedX and this.speedY are set to random values between -1.5 
 *     and 1.5, dictating the particle's movement speed and direction 
 *     along the X and Y axes.
 *   - this.color is initially set to a hue-saturation-lightness (HSL) 
 *     color value. The hue value is a variable defined outside 
 *     the class that changes over time, allowing the particle color 
 *     to vary.
 *   - If color is 1, the particle's color is set to a specific shade 
 *     of red (hsl(0, 25%, 35%)). If color is 2, it uses the varying 
 *     hue value with different saturation and lightness.
 * - update Method:
 *   - The update method updates the particle's position based on its 
 *     speed.
 *   - It also gradually decreases the particle's size 
 *     (as long as it's larger than 0.2) to create an effect of the 
 *     particle shrinking over time.
 * - draw Method:
 *   - The draw method is responsible for rendering the particle on the 
 *     canvas.
 *   - It draws a hexagon centered at (x, y) – the particle's current
 *     position – with a radius (r) of 50.
 *   - The color of the hexagon is set to the particle's color.
 *
 * Input: color.
 *
 * Output: Particle.
 *
******************************************************************************/
class Particle 
{
    /******************************************************************************
     * Method: constructor: 
     * 
     * - The constructor is called when a new instance of Particle is created.
     *
     * Input: color.
     *
     * Output: Particle.
     *
    ******************************************************************************/
    constructor(color) 
    {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ', 100%, 50%)'; 
        
        if (color == 1) 
        {
            this.color = 'hsl(0, 25%, 35%)'; /* red */
            console.log(this.color);
        } 
        else if (color == 2) 
        {
            this.color = 'hsl(' + hue + ', 60%, 50%)';
            console.log(this.color);
        }
    }

    /******************************************************************************
     * Method: update: 
     * 
     * - The update method updates the particle's position based on its
     *  speed.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    update() 
    {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }

    /******************************************************************************
     * Method: draw: 
     * 
     * - The draw method is responsible for rendering the particle on the
     * canvas.
     *
     * Input: x, y.
     *
     * Output: None.
     *
    ******************************************************************************/
    draw(x, y) 
    {
        const a = 2 * Math.PI / 6;
        const r = 50;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) 
        {
            ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        ctx.fill();
    }
}

/******************************************************************************
 * Method: handleParticles: 
 * 
 * - handleParticles function iterates through the particlesArray, updating
 * and drawing each particle.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
function handleParticles() 
{
    for (let i = 0; i < particlesArray.length; i++) 
    {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i; j < particlesArray.length; j++) 
        {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const value = Math.sin(distance);
            if (distance < 100) 
            {
                ctx.beginPath();
                ctx.strokeStyle = particlesArray[i].color;
                ctx.lineWidth = value;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
        if (particlesArray[i].size <= 0.3) 
        {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

/******************************************************************************
 * Method: animate: 
 * 
 * - The animate function clears the canvas and calls handleParticles
 * to update and draw the particles.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
function animate() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    hue+=2;
    requestAnimationFrame(animate);
}

animate();