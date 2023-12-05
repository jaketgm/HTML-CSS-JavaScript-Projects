/******************************************************************************
 * @author Jake Brockbank
 * Dec 5th, (Original)
 * This program is a simple drawing program that allows the user to draw
 * flowers on the screen. The flowers will grow and bloom as the user draws
 * them. The flowers will also bloom if the user holds down the mouse button
 * and moves the mouse around the screen.
******************************************************************************/

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
ctx.lineWidth = 1;

/******************************************************************************
 * Class: Root: 
 * 
 * - Constructor: The constructor is a special method for creating and 
 * initializing an object created with a class. In this case, it initializes 
 * a Root object with:
 *   - x and y: The starting position of the root.
 *   - speedX and speedY: Randomized horizontal and vertical speeds, which 
 *     will affect how the root moves.
 *   - maxSize: The maximum size the root can grow to, a randomized value.
 *   - size: The initial size of the root, also randomized.
 *   - vs: A growth speed for the size of the root.
 *   - angleX and angleY: Randomized angles that could be used to add some 
 *     oscillatory motion.
 *   - vax and vay: Variability in the angles' change rates, introducing 
 *     randomness to the oscillation.
 *   - lightness: An initial lightness value for the color, possibly 
 *     used in a color model like HSL (Hue, Saturation, Lightness).
 * - update() Method: 
 *   - This method is intended to be called repeatedly to animate the root. 
 *     Each time it's called, it:
 *     - Updates the x and y position of the root based on its speed and 
 *       a sine function applied to its angle, creating a natural, wavy 
 *       movement.
 *     - Increases the size of the root, simulating growth.
 *     - Adjusts the angleX and angleY using their variability rates, 
 *       which will influence the root's movement in future updates.
 *     - Increases the lightness to make the color of the root lighter 
 *       over time, up to a certain point.
 *     - Draws a circle at the new position with the updated size and 
 *       color, creating a visual representation of the root.
 *     - If the root has not reached its maxSize, it continues to 
 *       animate itself by calling 
 *       requestAnimationFrame(this.update.bind(this)), which requests 
 *       that the browser calls update again before the next repaint.
 *     - Once the root reaches its maxSize, it creates a Flower object 
 *       at its position and calls the grow method on that Flower. This 
 *       implies a transition from the root to a flower, though the 
 *       Flower class and its grow method are not shown in the provided 
 *       code.
 *
 * Input: x, y.
 *
 * Output: Root.
 *
******************************************************************************/
class Root
{
    /******************************************************************************
     * Method: constructor: 
     * 
     * - Constructor: The constructor is a special method for creating and
     * initializing an object created with a class. In this case, it initializes
     * a Root object with:
     *  - x and y: The starting position of the root.
     * - speedX and speedY: Randomized horizontal and vertical speeds, which
     *  will affect how the root moves.
     * - maxSize: The maximum size the root can grow to, a randomized value.
     * - size: The initial size of the root, also randomized.
     * - vs: A growth speed for the size of the root.
     * - angleX and angleY: Randomized angles that could be used to add some
     * oscillatory motion.
     * - vax and vay: Variability in the angles' change rates, introducing
     * randomness to the oscillation.
     * - lightness: An initial lightness value for the color, possibly
     * used in a color model like HSL (Hue, Saturation, Lightness).
     *
     * Input: x, y.
     *
     * Output: Root.
     *
    ******************************************************************************/
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.maxSize = Math.random() * 7 + 5;
        this.size = Math.random() * 1 + 2;
        this.vs = Math.random() * 0.2 + 0.05;
        this.angleX = Math.random() * 6.2;
        this.vax = Math.random() * 0.6 - 0.3;
        this.angleY = Math.random() * 6.2;
        this.vay = Math.random() * 0.6 - 0.3;
        this.lightness = 10;
    }

    /******************************************************************************
     * Method: update: 
     * 
     * - Position Update: Increments the x and y properties by the respective 
     * speeds (speedX and speedY) and a sine wave function of the angles 
     * (angleX and angleY). This creates a motion that combines linear movement 
     * with a wave-like oscillation.
     * - Size Growth: Increases the size of the root by a small amount (vs) 
     * each time the method is called, simulating growth over time.
     * - Angle Adjustment: Updates the angles (angleX and angleY) by small 
     * amounts (vax and vay), possibly to change the direction of the wave-like 
     * movement.
     * - Lightness Increment: If the lightness property is less than 70, it 
     * increases slightly, altering the color to become lighter.
     * - Drawing the Root: If the root's size is less than its maximum size 
     * (maxSize), the root is drawn on the canvas using the canvas context 
     * (ctx). It's drawn as a filled and stroked arc, with the color defined 
     * by an HSL value that changes as the root grows.
     * - Animation Continuation: If the root hasn't reached its maximum size, 
     * it continues the animation by calling 
     * requestAnimationFrame(this.update.bind(this)), which schedules the 
     * next update call, creating an animation loop.
     * - Flower Creation: Once the root reaches its maximum size, it stops 
     * growing and instead creates a Flower object at its current location 
     * and calls the grow() method on the flower, which suggests the simulation 
     * of a flower growing from the root.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    update()
    {
        this.x += this.speedX + Math.sin(this.angleX);
        this.y += this.speedY + Math.sin(this.angleY);
        this.size += this.vs;
        this.angleX += this.vax;
        this.angleY += this.vay;
        if (this.lightness < 70) this.lightness += 0.25;
        if (this.size < this.maxSize)
        {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'hsl(140, 100%,' + this.lightness + '%)';
            ctx.fill();
            ctx.stroke();
            requestAnimationFrame(this.update.bind(this));
        }
        else
        {
            const flower = new Flower(this.x, this.y, this.size);
            flower.grow();
        }
    }
}

/******************************************************************************
 * Class: Flower: 
 * 
 * - Constructor: The constructor is a special method for creating and
 * initializing an object created with a class. In this case, it initializes
 * a Flower object with:
 * - x and y: The starting position of the flower.
 * - size: The initial size of the flower.
 * - vs: A growth speed for the size of the flower.
 * - maxFlowerSize: The maximum size the flower can grow to, a randomized
 * value.
 * - image: An image object that will be used to draw the flower.
 * - frameSize: The size of each frame in the image.
 * - frameX and frameY: Randomized frame coordinates, which will be used to
 * select a frame from the image.
 * - willFlower: A boolean value that determines whether the flower will
 * grow or not.
 * - angle: An initial angle for the flower.
 * - va: A change rate for the angle.
 * - grow() Method: This method is intended to be called repeatedly to
 * animate the flower. Each time it's called, it:
 *   - Increases the size of the flower, simulating growth.
 *   - Increases the angle of the flower, possibly to rotate it.
 *   - Draws the flower at the current position with the updated size and
 *     angle, creating a visual representation of the flower.
 *   - If the flower has not reached its maxFlowerSize, it continues to
 *     animate itself by calling requestAnimationFrame(this.grow.bind(this)).
 *   - Once the flower reaches its maxFlowerSize, it stops growing and
 *     disappears.
 *
 * Input: x, y, size.
 *
 * Output: Flower.
 *
******************************************************************************/
class Flower 
{
    /******************************************************************************
     * Method: constructor: 
     * 
     * - Constructor: The constructor is a special method for creating and
     * initializing an object created with a class. In this case, it initializes
     * a Flower object with.
     *
     * Input: x, y, size.
     *
     * Output: Flower.
     *
    ******************************************************************************/
    constructor(x, y, size)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vs = Math.random() * 0.3 + 0.2;
        this.maxFlowerSize = this.size + Math.random() * 100;
        this.image = new Image();
        this.image.src = 'flowers.png';
        this.frameSize = 100;
        this.frameX = Math.floor(Math.random() * 3);
        this.frameY = Math.floor(Math.random() * 3);
        this.size > 11.5 ? this.willFlower = true : this.willFlower = false;
        this.angle = 0;
        this.va = Math.random() * 0.05 - 0.025;
    }

    /******************************************************************************
     * Method: grow: 
     * 
     * - This method is intended to be called repeatedly to animate the flower.
     * Each time it's called, it:
     *   - Increases the size of the flower, simulating growth.
     *   - Increases the angle of the flower, to rotate it.
     *   - Draws the flower at the current position with the updated size and
     *     angle, creating a visual representation of the flower.
     *   - If the flower has not reached its maxFlowerSize, it continues to
     *     animate itself by calling requestAnimationFrame(this.grow.bind(this)).
     *   - Once the flower reaches its maxFlowerSize, it stops growing and
     *     disappears.
     *
     * Input: x, y, size.
     *
     * Output: Flower.
     *
    ******************************************************************************/
    grow()
    {
        if (this.size < this.maxFlowerSize && this.willFlower)
        {
            this.size += this.vs;
            this.angle += this.va;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, this.frameSize * this.frameX, this.frameSize * this.frameY, this.frameSize, this.frameSize, 0 - this.size/2, 0 - this.size/2, this.size, this.size);
            ctx.restore();
            requestAnimationFrame(this.grow.bind(this));
        }
    }
}

/******************************************************************************
 * Method: mousemove: 
 * 
 * - This method ensures that the user can draw flowers by moving the mouse
 * around the screen. It creates a root object at the current mouse position
 * and calls the update method on that root. This implies a transition from
 * the mouse to a root.
 *
 * Input: e.
 *
 * Output: None.
 *
******************************************************************************/
window.addEventListener('mousemove', function(e)
{
    if (drawing)
    {
        for (let i = 0; i < 3; i++)
        {
            const root = new Root(e.x, e.y);
            root.update();
        }
    }
});

/******************************************************************************
 * Method: mousedown: 
 * 
 * - This method ensures that the user can draw flowers by holding down the
 * mouse button and moving the mouse around the screen. It creates a root
 * object at the current mouse position and calls the update method on that
 * root. This implies a transition from the mouse to a root.
 *
 * Input: e.
 *
 * Output: None.
 *
******************************************************************************/
window.addEventListener('mousedown', function(e) 
{
    drawing = true;
    for (let i = 0; i < 30; i++)
    {
        const root = new Root(e.x, e.y);
        root.update();
    }
});

/******************************************************************************
 * Method: mouseup: 
 * 
 * - This method ensures that once the user stops holding down the mouse
 * button, they can no longer draw flowers by moving the mouse around the
 * screen.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
window.addEventListener('mouseup', function() 
{
    drawing = false;
});