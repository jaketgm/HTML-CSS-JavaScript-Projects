/******************************************************************************
 * @author Jake Brockbank
 * Dec 5th, 2023 (Original)
 * This program is a fluid simulation that uses the mouse to create a fluid
 * effect.
******************************************************************************/

(function(w) {
    /******************************************************************************
     * Class: CanvasSettings: 
     * 
     * - When we create an instance of CanvasSettings, we provide these values, 
     * and the resulting object encapsulates all these canvas-related settings. 
     * This is useful for managing the configuration of our canvas in a structured 
     * and organized manner.
     *
     * Input: width, height, resolution, penSize, speckCount.
     *
     * Output: width, height, resolution, penSize, speckCount, numCols, numRows.
     *
    ******************************************************************************/
    class CanvasSettings 
    {
        constructor(width, height, resolution, penSize, speckCount) 
        {
            this.width = width;
            this.height = height;
            this.resolution = resolution;
            this.penSize = penSize;
            this.numCols = width / resolution;
            this.numRows = height / resolution;
            this.speckCount = speckCount;
        }
    }
    
    /******************************************************************************
     * Class: Mouse: 
     * 
     * - This creates a similar mouse object to the one in the original 
     * CanvasSettings.
     *
     * Input: None.
     *
     * Output: x, y, px, py, down.
     *
    ******************************************************************************/
    class Mouse 
    {
        constructor() 
        {
            this.x = 0;
            this.y = 0;
            this.px = 0;
            this.py = 0;
            this.down = false;
        }
    }
    
    /******************************************************************************
     * Class: ParticleSystem: 
     * 
     * - This creates a similar particle system object to the one in the original
     * CanvasSettings.
     *
     * Input: None.
     *
     * Output: vecCells, particles.
     *
    ******************************************************************************/
    class ParticleSystem 
    {
        constructor() 
        {
            this.vecCells = [];
            this.particles = [];
        }
    }
    
    var canvas, ctx;
    var mouse = new Mouse();
    var settings = new CanvasSettings(500, 500, 10, 40, 5000);
    var particleSystem = new ParticleSystem();
  
    /******************************************************************************
     * Method: init: 
     * 
     * - This initializes the canvas and the particles.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    function init() 
    {
        canvas = document.getElementById("c");
        ctx = canvas.getContext("2d");
    
        canvas.width = settings.width;
        canvas.height = settings.height;
    
        // Initialize particles
        Array.from({ length: settings.speckCount }).forEach(() => {
            particleSystem.particles.push(new Particle(Math.random() * settings.width, Math.random() * settings.height));
        });
    
        Array.from({ length: settings.numCols }).forEach((_, col) => {
            particleSystem.vecCells[col] = [];

            Array.from({ length: settings.numRows }).forEach((_, row) => {
                let cell = new Cell(col * settings.resolution, row * settings.resolution, settings.resolution);
                particleSystem.vecCells[col][row] = cell;
            });
        });
    
        setUpCellNeighbors();
    
        window.addEventListener("mousedown", mouse_down_handler);
        window.addEventListener("touchstart", touch_start_handler);
        window.addEventListener("mouseup", mouse_up_handler);
        window.addEventListener("touchend", touch_end_handler);
        canvas.addEventListener("mousemove", mouse_move_handler);
        canvas.addEventListener("touchmove", touch_move_handler);
    
        // Start the draw loop
        draw();
    }

    /******************************************************************************
     * Method: setUpCellNeighbors: 
     * 
     * - Outer Loop - Columns: The function iterates over each column in the grid. 
     *   - Array.from({ length: settings.numCols }) creates an array with a 
     *     length equal to the number of columns (settings.numCols). The forEach 
     *     loop then iterates over this array, where col represents the current 
     *     column index.
     * - Inner Loop - Rows: For each column, the function iterates over each row. 
     *   - Array.from({ length: settings.numRows }) creates an array with a length 
     *     equal to the number of rows (settings.numRows). The nested forEach loop 
     *     iterates over this array, with row representing the current row index.
     * - Neighbor Calculation:
     *   - For each cell identified by its col and row coordinates, the function 
     *     determines its neighboring cells:
     *     - up: The cell above. If it's the first row, it wraps around to the 
     *       last row.
     *     - left: The cell to the left. If it's the first column, it wraps 
     *       around to the last column.
     *     - up_left: The cell diagonally up-left. This considers wrapping both 
     *       in rows and columns.
     *     - up_right: The cell diagonally up-right. Wrapping is considered for 
     *       the right edge and top row.
     * - Setting Neighbors:
     *   - Each cell’s up, left, up_left, and up_right properties are set to 
     *     reference the corresponding neighboring cells.
     *   - The function also sets the opposite directions for the neighboring 
     *     cells. For instance, the down property of the up cell and the right 
     *     property of the left cell are set to point back to the original cell. 
     *     This is done for down_right of up_left and down_left of up_right as 
     *     well.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    function setUpCellNeighbors() 
    {
        Array.from({ length: settings.numCols }).forEach((_, col) => {
            Array.from({ length: settings.numRows }).forEach((_, row) => {
                var cell = particleSystem.vecCells[col][row];
                var row_up = (row - 1 >= 0) ? row - 1 : settings.numRows - 1;
                var col_left = (col - 1 >= 0) ? col - 1 : settings.numCols - 1;
                var col_right = (col + 1 < settings.numCols) ? col + 1 : 0;
        
                var up = particleSystem.vecCells[col][row_up];
                var left = particleSystem.vecCells[col_left][row];
                var up_left = particleSystem.vecCells[col_left][row_up];
                var up_right = particleSystem.vecCells[col_right][row_up];
        
                cell.up = up;
                cell.left = left;
                cell.up_left = up_left;
                cell.up_right = up_right;
        
                up.down = particleSystem.vecCells[col][row];
                left.right = particleSystem.vecCells[col][row];
                up_left.down_right = particleSystem.vecCells[col][row];
                up_right.down_left = particleSystem.vecCells[col][row];
            });
        });
    }

    /******************************************************************************
     * Method: update_particle: 
     * 
     * - Iterating Over Particles: The function iterates over each particle in 
     *   - the particleSystem.particles array using forEach. For each particle p, 
     *     the following operations are performed:
     *     - Boundary Check: It checks if the particle's current position 
     *       (p.x and p.y) is within the bounds of the canvas defined by 
     *       settings.width and settings.height. If the particle is outside these 
     *       bounds, it is repositioned randomly within the canvas, and its 
     *       velocity is reset to zero.
     * - Particle-Cell Interaction:
     *   - If the particle is within the canvas bounds, the function calculates 
     *     which grid cell (col and row) the particle is currently over, based 
     *     on its x and y coordinates and the resolution of the grid.
     *   - It retrieves the data of the underlying cell (cell_data) from 
     *     particleSystem.vecCells.
     * - Velocity Calculation:
     *   - The function calculates two percentages (ax and ay), representing how 
     *     far the particle is along the X and Y axes within the current cell.
     *   - The particle's velocity (p.xv and p.yv) is then adjusted based on the 
     *     velocities of the current cell and its right and down neighbors. This 
     *     adjustment simulates the influence of the fluid or field in the cell 
     *     on the particle.
     * - Updating Particle Position:
     *   - The particle's position is updated by adding its velocity to its 
     *     current coordinates.
     *   - If the particle has moved a certain distance 
     *     (greater than a random limit), a line is drawn from its previous 
     *     position to its new position. This creates a visual representation of 
     *     the particle's movement.
     *   - If the particle hasn't moved beyond this limit, a short line 
     *     segment is drawn to create a shimmering effect.
     * - Storing Previous Position: The particle’s previous position 
     *   (p.px, p.py) is updated to its current position for the next 
     *   iteration.
     * - Slowing Down Particles: Finally, the particle's velocity is reduced by 
     *   half, which gradually slows down the particle over time.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    function update_particle() 
    {
        particleSystem.particles.forEach(p => {
            //If the particle's X and Y coordinates are within the bounds of the canvas
            if (p.x >= 0 && p.x < settings.width && p.y >= 0 && p.y < settings.height) 
            {
                var col = parseInt(p.x / settings.resolution);
                var row = parseInt(p.y / settings.resolution);
        
                var cell_data = particleSystem.vecCells[col][row];
                
                var ax = (p.x % settings.resolution) / settings.resolution;
                var ay = (p.y % settings.resolution) / settings.resolution;
                
                p.xv += (1 - ax) * cell_data.xv * 0.05;
                p.yv += (1 - ay) * cell_data.yv * 0.05;
        
                p.xv += ax * cell_data.right.xv * 0.05;
                p.yv += ax * cell_data.right.yv * 0.05;
                
                p.xv += ay * cell_data.down.xv * 0.05;
                p.yv += ay * cell_data.down.yv * 0.05;
                
                p.x += p.xv;
                p.y += p.yv;
                
                var dx = p.px - p.x;
                var dy = p.py - p.y;
        
                var dist = Math.sqrt(dx * dx + dy * dy);
                var limit = Math.random() * 0.5;
                
                if (dist > limit) 
                {
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.px, p.py);
                    ctx.stroke();
                } 
                else 
                {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + limit, p.y + limit);
                    ctx.stroke();
                }
                
                p.px = p.x;
                p.py = p.y;
            } 
            else 
            {
                p.x = p.px = Math.random() * settings.width;
                p.y = p.py = Math.random() * settings.height;
                p.xv = 0;
                p.yv = 0;
            }
            
            p.xv *= 0.5;
            p.yv *= 0.5;
        });
    }

    /******************************************************************************
     * Method: draw: 
     * 
     * - This method is the main loop of the program.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    function draw() 
    {
        var mouse_xv = mouse.x - mouse.px;
        var mouse_yv = mouse.y - mouse.py;

        particleSystem.vecCells.forEach(cell_datas => {
            cell_datas.forEach(cell_data => {
                // If the mouse button is down, updates the cell velocity using the mouse velocity
                if (mouse.down) 
                {
                    change_cell_velocity(cell_data, mouse_xv, mouse_yv, settings.penSize);
                }
        
                // This updates the pressure values for the cell.
                update_pressure(cell_data);
            });
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = "#00FFFF";
  
        update_particle();

        particleSystem.vecCells.forEach(cell_datas => {
            cell_datas.forEach(cell_data => {
                // This updates the velocity for the cell.
                update_velocity(cell_data);
            });
        });
        
        //This replaces the previous mouse coordinates values with the current ones for the next frame.
        mouse.px = mouse.x;
        mouse.py = mouse.y;
  
        requestAnimationFrame(draw);
    }

    /******************************************************************************
     * Method: change_cell_velocity: 
     * 
     * - Calculating Distance to Mouse: The function first calculates the 
     *   Euclidean distance between the current cell's position 
     *   (cell_data.x, cell_data.y) and the mouse's position (mouse.x, mouse.y). 
     *   It does this by computing the differences in x and y coordinates (dx, dy) 
     *   and then applying the Pythagorean theorem.
     * - Checking Proximity to Mouse:
     *   - It checks if this distance is less than the pen_size. The pen_size 
     *     represents a radius around the mouse cursor, defining an area of 
     *     influence where the mouse can affect cells.
     *   - If the cell is within this area, the function proceeds to 
     *     modify the cell's velocity.
     * - Adjusting for Small Distances:
     *   - If the distance between the cell and the mouse cursor is very small 
     *     (less than 4 units in this case), the distance is set to pen_size. 
     *     This adjustment prevents excessively high velocities that would 
     *     occur if the distance were extremely small (as velocity is 
     *     inversely proportional to distance).
     * - Calculating Influence Power:
     *   - The function calculates power, which determines how strongly the 
     *     mouse's movement affects the cell's velocity. This is calculated as 
     *     pen_size / dist, meaning cells closer to the mouse cursor are 
     *     more strongly influenced than those farther away.
     * - Modifying Cell Velocity:
     *   - The cell's velocity (cell_data.xv, cell_data.yv) is then adjusted by 
     *     adding a portion of the mouse's velocity (mvelX, mvelY) multiplied by 
     *     power. This simulates the effect of "pushing" or influencing the 
     *     fluid or particles in the simulation based on the mouse movement.
     *
     * Input: cell_data, mvelX, mvelY, pen_size.
     *
     * Output: None.
     *
    ******************************************************************************/
    function change_cell_velocity(cell_data, mvelX, mvelY, pen_size) 
    {
        //This gets the distance between the cell and the mouse cursor.
        var dx = cell_data.x - mouse.x;
        var dy = cell_data.y - mouse.y;
        var dist = Math.sqrt(dy * dy + dx * dx);
        
        //If the distance is less than the radius...
        if (dist < pen_size) 
        {
            //If the distance is very small, set it to the pen_size.
            if (dist < 4) 
            {
                dist = pen_size;
            }
            
            //Calculate the magnitude of the mouse's effect (closer is stronger)
            var power = pen_size / dist;
  
            cell_data.xv += mvelX * power;
            cell_data.yv += mvelY * power;
        }
    }
    
    /******************************************************************************
     * Method: update_pressure: 
     * 
     * - Calculating Pressure Components:
     *   - The function calculates two components of pressure, pressure_x and 
     *     pressure_y, which correspond to the pressures along the X-axis and 
     *     Y-axis, respectively.
     *   - pressure_x is calculated by summing the horizontal velocities (xv) 
     *     of the neighboring cells. The cells to the left (left), up-left 
     *     (up_left), and down-left (down_left) contribute positively to the 
     *     pressure, while the cells to the right (right), up-right (up_right), 
     *     and down-right (down_right) contribute negatively. The velocities of 
     *     diagonal neighbors (up-left, up-right, down-left, down-right) are 
     *     halved (* 0.5) to account for their diagonal distance.
     *   - pressure_y is calculated similarly, but it sums the vertical 
     *     velocities (yv) of the neighboring cells.
     * - Setting the Cell's Pressure:
     *   - The function then sets the cell's pressure (cell_data.pressure) to 
     *     be one-fourth of the sum of pressure_x and pressure_y. This average 
     *     is likely used to normalize the pressure value based on the 
     *     contributions from both axes.
     *
     * Input: cell_data.
     *
     * Output: None.
     *
    ******************************************************************************/
    function update_pressure(cell_data) 
    {
        var pressure_x = (
            cell_data.up_left.xv * 0.5 //Divided in half because it's diagonal
            + cell_data.left.xv
            + cell_data.down_left.xv * 0.5 //Same
            - cell_data.up_right.xv * 0.5 //Same
            - cell_data.right.xv
            - cell_data.down_right.xv * 0.5 //Same
        );
        
        var pressure_y = (
            cell_data.up_left.yv * 0.5
            + cell_data.up.yv
            + cell_data.up_right.yv * 0.5
            - cell_data.down_left.yv * 0.5
            - cell_data.down.yv
            - cell_data.down_right.yv * 0.5
        );
        
        //This sets the cell pressure to one-fourth the sum of both axis pressure.
        cell_data.pressure = (pressure_x + pressure_y) * 0.25;
    }
    
    /******************************************************************************
     * Method: update_velocity: 
     * 
     * - Updating X-Axis Velocity (xv):
     *   - The function calculates a new horizontal velocity (xv) for the cell 
     *     by considering the pressures of neighboring cells on the left, right, 
     *     and diagonally up-left and down-right.
     *   - Pressures from cells up_left, left, and down_left contribute 
     *     positively, while pressures from up_right, right, and down_right 
     *     contribute negatively. The pressures from diagonally neighboring 
     *     cells are halved (* 0.5) to account for their diagonal distance.
     *   - The total influence from these neighboring cells is then scaled down 
     *     (* 0.25) to moderate the change in velocity.
     * - Updating Y-Axis Velocity (yv):
     *   - Similarly, the new vertical velocity (yv) is calculated by 
     *     considering the pressures of cells above, below, and diagonally 
     *     adjacent to the cell.
     *   - Pressures from up_left, up, and up_right increase the vertical 
     *     velocity, while pressures from down_left, down, and down_right 
     *     decrease it. Again, the pressures from diagonally adjacent cells 
     *     are halved, and the total is scaled down.
     * - Damping the Velocities:
     *   - After updating both horizontal and vertical velocities, the 
     *     function applies a damping factor (* 0.99) to both xv and yv. 
     *     This damping reduces the velocities slightly, simulating friction 
     *     or resistance, which prevents the velocities from continually 
     *     increasing over time.
     *
     * Input: cell_data.
     *
     * Output: None.
     *
    ******************************************************************************/
    function update_velocity(cell_data) 
    {
        cell_data.xv += (
            cell_data.up_left.pressure * 0.5
            + cell_data.left.pressure
            + cell_data.down_left.pressure * 0.5
            - cell_data.up_right.pressure * 0.5
            - cell_data.right.pressure
            - cell_data.down_right.pressure * 0.5
        ) * 0.25;
        
        //This does the same for the Y axis.
        cell_data.yv += (
            cell_data.up_left.pressure * 0.5
            + cell_data.up.pressure
            + cell_data.up_right.pressure * 0.5
            - cell_data.down_left.pressure * 0.5
            - cell_data.down.pressure
            - cell_data.down_right.pressure * 0.5
        ) * 0.25;
        
        cell_data.xv *= 0.99;
        cell_data.yv *= 0.99;
    }
  
    /******************************************************************************
     * Class: Cell: 
     * 
     * - This creates a similar cell object.
     *
     * Input: x, y, resolution.
     *
     * Output: x, y, resolution, xv, yv, pressure.
     *
    ******************************************************************************/
    class Cell 
    {
        constructor(x, y, resolution) 
        {
            this.x = x;
            this.y = y;
            this.resolution = resolution;
            this.xv = 0;
            this.yv = 0;
            this.pressure = 0;
        }
    }

    /******************************************************************************
     * Class: Particle: 
     * 
     * - This creates a similar particle object.
     *
     * Input: x, y.
     *
     * Output: x, px, y, py, xv, yv.
     *
    ******************************************************************************/
    class Particle 
    {
        constructor(x, y) 
        {
            this.x = x;
            this.px = x; // Previous x position
            this.y = y;
            this.py = y; // Previous y position
            this.xv = 0; // x velocity
            this.yv = 0; // y velocity
        }
    }
    
    /******************************************************************************
     * Method: mouse_down_handler: 
     * 
     * - Updates the mouse object's "down" value to true.
     *
     * Input: e.
     *
     * Output: None.
     *
    ******************************************************************************/
    function mouse_down_handler(e) 
    {
        e.preventDefault(); //Prevents the default action from happening (e.g. navigation)
        mouse.down = true; //Sets the mouse object's "down" value to true
    }
  
    /******************************************************************************
     * Method: mouse_up_handler: 
     * 
     * - Updates the mouse object's "down" value to false.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    function mouse_up_handler() 
    {
        mouse.down = false; 
    }
    
    /******************************************************************************
     * Method: touch_start_handler: 
     * 
     * - This is the same as the mouse_down_handler, but for touch screens.
     *
     * Input: e.
     *
     * Output: None.
     *
    ******************************************************************************/
    function touch_start_handler(e) 
    {
        e.preventDefault(); //Prevents the default action from happening (e.g. navigation)
        var rect = canvas.getBoundingClientRect();
        mouse.x = mouse.px = e.touches[0].pageX - rect.left; //Set both previous and current coordinates
        mouse.y = mouse.py = e.touches[0].pageY - rect.top;
        mouse.down = true; //Sets the mouse object's "down" value to true
    }
  
    /******************************************************************************
     * Method: touch_end_handler: 
     * 
     * - This is the same as the mouse_up_handler, but for touch screens.
     *
     * Input: e.
     *
     * Output: None.
     *
    ******************************************************************************/
    function touch_end_handler(e) 
    {
        if (!e.touches) mouse.down = false; //If there are no more touches on the screen, sets "down" to false.
    }
  
    /******************************************************************************
     * Method: mouse_move_handler: 
     * 
     * - This updates the mouse object's coordinates.
     *
     * Input: e.
     *
     * Output: None.
     *
    ******************************************************************************/
    function mouse_move_handler(e) 
    {
        e.preventDefault(); //Prevents the default action from happening
        //Saves the previous coordinates
        mouse.px = mouse.x;
        mouse.py = mouse.y;
  
        //Sets the new coordinates
        mouse.x = e.offsetX || e.layerX;
        mouse.y = e.offsetY || e.layerY;
    }
  
    /******************************************************************************
     * Method: touch_move_handler: 
     * 
     * - This is the same as the mouse_move_handler, but for touch screens.
     *
     * Input: e.
     *
     * Output: None.
     *
    ******************************************************************************/
    function touch_move_handler(e) 
    {
        e.preventDefault(); //Prevents the default action from happening
        mouse.px = mouse.x;
        mouse.py = mouse.y;
  
        //This line gets the coordinates for where the canvas is positioned on the screen.
        var rect = canvas.getBoundingClientRect();

        mouse.x = e.touches[0].pageX - rect.left;
        mouse.y = e.touches[0].pageY - rect.top;
    }
  
    w.Fluid = {
        initialize: init
    }
  
}(window)); //Passes "window" into the self-invoking function.
  
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

Fluid.initialize();