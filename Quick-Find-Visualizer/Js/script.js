/******************************************************************************
 * @author Jake Brockbank
 * Dec 5th, (Original)
 * This program is a quick find algorithm that checks if two dots are connected
 * in a grid.
******************************************************************************/

var svg = document.querySelector('svg');
var gridData = [];

/******************************************************************************
 * Method: clearGrid: 
 * 
 * - Clears the grid.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
function clearGrid() 
{
    svg.innerHTML = '';
    gridData = [];
}

/******************************************************************************
 * Method: initializeGridData: 
 * 
 * - Array.from({ length: 20 }, () => ... ): This creates an array of 20 
 * elements. The Array.from() function is being used to generate an array 
 * from an array-like object with a length property.
 * - () => Array.from({ length: 20 }, () => ({ redDot: false })): For 
 * each of the 20 elements, a function is executed that creates another 
 * array of 20 elements. Each of these inner array elements is an object 
 * with the redDot property set to false.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
function initializeGridData() 
{
    gridData = Array.from({ length: 20 }, () => 
        Array.from({ length: 20 }, () => ({ redDot: false }))
    );
}

/******************************************************************************
 * Method: createSVGElement: 
 * 
 * - document.createElementNS("http://www.w3.org/2000/svg", type): This 
 * line creates an SVG element of the specified type. The createElementNS 
 * function is used instead of createElement because SVG elements are in a 
 * different namespace (http://www.w3.org/2000/svg) than regular HTML elements.
 * - The for loop iterates over the attributes object passed to the function. 
 * For each key-value pair in the attributes object, it calls 
 * element.setAttribute(key, attributes[key]) to set the attribute on the
 * newly created SVG element. This sets all the provided attributes on the 
 * element, such as x, y, width, height, fill, etc.
 * - Finally, the function returns the newly created SVG element with
 * all the specified attributes applied to it.
 *
 * Input: type, attributes.
 *
 * Output: element.
 *
******************************************************************************/
function createSVGElement(type, attributes) 
{
    var element = document.createElementNS("http://www.w3.org/2000/svg", type);
    for (var key in attributes) 
    {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}

/******************************************************************************
 * Method: drawDot: 
 * 
 * - This function creates a circle SVG element with the specified x, y, and
 * r attributes. It also sets the fill attribute to red.
 *
 * Input: x, y.
 *
 * Output: None.
 *
******************************************************************************/
function drawDot(x, y) 
{
    var circle = createSVGElement("circle", {
        cx: x,
        cy: y,
        r: 8,
        fill: "red"
    });
    svg.appendChild(circle);
}

/******************************************************************************
 * Method: drawLine: 
 * 
 * - This function creates a line SVG element with the specified x1, y1, x2,
 * y2 attributes. It also sets the stroke attribute to black and the
 * stroke-width attribute to 2.
 *
 * Input: x1, y1, x2, y2.
 *
 * Output: None.
 *
******************************************************************************/
function drawLine(x1, y1, x2, y2) 
{
    var line = createSVGElement("line", {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: "black",
        "stroke-width": "2"
    });
    svg.appendChild(line);
}

/******************************************************************************
 * Method: grid: 
 * 
 * - This function clears the grid, initializes the grid data, and draws the
 * grid.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
function grid() 
{
    clearGrid();
    initializeGridData();

    var padding = 30; // Space for labels
    var gridSize = 20; // Number of cells
    var cellSize = 20; // Size of each cell

    // Draw the grid dots and lines with padding
    for (var i = 0; i < gridSize; i++) 
    {
        for (var j = 0; j < gridSize; j++) 
        {
            if (Math.random() < 0.09) 
            {
                drawDot(j * cellSize + padding, i * cellSize + padding);
                gridData[i][j].redDot = true;
            }
        }
    }

    // Connect the red dots with lines
    for (var i = 0; i < gridData.length; i++) 
    {
        for (var j = 0; j < gridData[i].length; j++) 
        {
            if (gridData[i][j].redDot) 
            {
                if (i > 0 && gridData[i - 1][j].redDot) 
                {
                    drawLine(j * cellSize + padding, i * cellSize + padding, j * cellSize + padding, (i - 1) * cellSize + padding);
                }
                if (j > 0 && gridData[i][j - 1].redDot) 
                {
                    drawLine(j * cellSize + padding, i * cellSize + padding, (j - 1) * cellSize + padding, i * cellSize + padding);
                }
            }
        }
    }

    // Add coordinate labels
    for (var i = 0; i < gridSize; i++) 
    {
        drawText(padding, i * cellSize + padding + 10, i.toString(), "end");
        drawText(i * cellSize + padding + 10, padding, i.toString(), "middle");
    }
}

/******************************************************************************
 * Method: drawText: 
 * 
 * - This function creates a text SVG element with the specified x, y, and
 * text attributes. It also sets the font-size attribute to 12, the
 * text-anchor attribute to the specified anchor, and the dominant-baseline
 * attribute to middle.
 *
 * Input: x, y, text, anchor.
 *
 * Output: None.
 *
******************************************************************************/
function drawText(x, y, text, anchor) 
{
    var textElement = createSVGElement("text", {
        x: x,
        y: y,
        "font-size": "12",
        "text-anchor": anchor,
        "dominant-baseline": "middle",
        "transform": "translate(-10, -10)"
    });
    textElement.textContent = text;
    svg.appendChild(textElement);
}

/******************************************************************************
 * Method: checkConnected: 
 * 
 * - This function checks if the two dots are connected.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
function checkConnected() 
{
    var dotInputOne = document.getElementById('dotOne');
    var dotInputTwo = document.getElementById('dotTwo');

    var dotOneValue = dotInputOne.value.split(',').map(function(coord) {
        return parseInt(coord.trim());
    });
    var dotTwoValue = dotInputTwo.value.split(',').map(function(coord) {
        return parseInt(coord.trim());
    });

    var qFind = new quickFind();
    qFind.setArray(gridData);

    var connected = qFind.isConnected(dotOneValue, dotTwoValue);
    alert('Dots ' + dotOneValue + ' and ' + dotTwoValue + ' are connected: ' + connected);
}

/******************************************************************************
 * Class: quickFind: 
 * 
 * - This class performs the quick find algorithm.
 *
 * Input: None.
 *
 * Output: None.
 *
******************************************************************************/
class quickFind 
{
    /******************************************************************************
     * Method: constructor: 
     * 
     * - This function is the constructor for the quick find class.
     *
     * Input: None.
     *
     * Output: None.
     *
    ******************************************************************************/
    constructor() {}

    /******************************************************************************
     * Method: setArray: 
     * 
     * - This function sets the array.
     *
     * Input: data.
     *
     * Output: None.
     *
    ******************************************************************************/
    setArray(data) 
    {
        gridData = data;
    }

    /******************************************************************************
     * Method: isConnected: 
     * 
     * - This function checks if the two dots are connected.
     *
     * Input: dotOne, dotTwo.
     *
     * Output: None.
     *
    ******************************************************************************/
    isConnected(dotOne, dotTwo) 
    {
        if (!this.isValidCoordinate(dotOne) || !this.isValidCoordinate(dotTwo)) 
        {
            return false;
        }

        return (
            gridData[dotOne[0]][dotOne[1]].redDot &&
            gridData[dotTwo[0]][dotTwo[1]].redDot
        );
    }

    /******************************************************************************
     * Method: isValidCoordinate: 
     * 
     * - This function checks if the coordinate is valid.
     *
     * Input: dot.
     *
     * Output: None.
     *
    ******************************************************************************/
    isValidCoordinate(dot) 
    {
        return (
            dot[0] >= 0 && dot[0] < gridData.length &&
            dot[1] >= 0 && dot[1] < gridData[0].length
        );
    }
}

grid();