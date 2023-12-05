/******************************************************************************
 * @author Jake Brockbank
 * Dec 5th, 2023 (Original)
 * Variable Assignments:
 *   - selectColor is a reference to an HTML element with the ID 
 *     primary-navigation-selectColor.
 *   - selectText is a reference to an HTML element with the ID selectText.
 *   - options is a collection of HTML elements with the class name options.
 *   - list is a reference to an HTML element with the ID list.
 *   - arrowIcon is a reference to an HTML element with the ID arrowIcon.
 * - Click Event for selectColor:
 *   - When the selectColor element is clicked, the list element's class list 
 *     is toggled to add or remove the class hide, and the arrowIcon element's 
 *     class list is toggled to add or remove the class rotate. This could 
 *     show/hide the list and rotate the arrowIcon, typically to indicate 
 *     expansion or collapse of a dropdown menu or similar component.
 * - Click Event for Each option:
 *   - The code sets up a click event listener for each element in the options 
 *     collection.
 *   - When an option element is clicked, two things happen:
 *     - The selectText element's inner HTML is updated to the text content 
 *       of the clicked option. This is typically used to display the selected 
 *       option's text in another part of the interface, such as a 
 *       placeholder for a dropdown.
 *     - The list and arrowIcon elements are toggled in the same way as in 
 *       the selectColor click event. This usually means that after selecting 
 *       an option, the list hides itself and the arrow icon toggles its 
 *       rotation state, often indicating that the list has closed.
******************************************************************************/

var selectColor = document.getElementById("primary-navigation-selectColor");
var selectText = document.getElementById("selectText");
var options = document.getElementsByClassName("options");
var list = document.getElementById("list");
var arrowIcon = document.getElementById("arrowIcon");

selectColor.onclick = function() {
    list.classList.toggle("hide");
    arrowIcon.classList.toggle("rotate");
}

for (option of options) 
{
    option.onclick = function() 
    {
        selectText.innerHTML = this.textContent;
        list.classList.toggle("hide");
        arrowIcon.classList.toggle("rotate");
    }
}