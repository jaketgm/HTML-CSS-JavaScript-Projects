/******************************************************************************
 * @author Jake Brockbank
 * Dec 5th, 2023 (Original)
 * This program reads a file and converts it from YCbCr to RGB
 * as well as displaying the pixel data in a table.
******************************************************************************/

import { readFile, writeFile } from 'fs';

const filename = 'output';

/******************************************************************************
 * Method: readFile: 
 * 
 * - readFile(filename, (err, data) => {...}):
 *   - This is an asynchronous file read operation using Node.js's fs 
 *     module's readFile function. It takes a filename as input and provides 
 *     a callback function that receives two parameters, err and data.
 *   - If an error occurs during the read operation (err is not null), the 
 *     error is thrown, which will typically crash the Node.js process unless 
 *     caught by an error handler.
 *   - If the file is read successfully, data will contain its contents.
 * - const buffer = Buffer.from(data);:
 *   - This line creates a Buffer from the data read from the file. A Buffer 
 *     is a raw binary data buffer in Node.js.
 * - The for loop iterates over the buffer:
 *   - The loop increments by 4 in each iteration, suggesting that each pixel 
 *     is represented by 4 bytes, likely corresponding to the YCbCrA 
 *     (YCbCr with alpha) color space, where Y is the luma component 
 *     (brightness), Cb and Cr are the chroma components, and A is the 
 *     alpha (transparency).
 *   - Inside the loop, y, cb, cr, and a variables are assigned to each of 
 *     the 4 bytes that represent one pixel.
 * - Color Space Conversion:
 *   - The next three lines inside the loop convert the YCbCr color values 
 *     to RGB color values using a standard formula.
 *   - r, g, and b are calculated using the formulas that convert YCbCr to 
 *     RGB, taking into account JPEG conversion standards 
 *     (hence the subtraction of 128 from the Cb and Cr values, as the chroma 
 *     components can be both positive and negative around a midpoint of 128).
 *   - Math.max and Math.min are used to ensure that the calculated RGB 
 *     values are clamped between 0 and 255, which are the valid ranges for 
 *     RGB color values.
 * - pixelData.push({ x: i / 4, r, g, b });:
 *   - This line pushes an object to the pixelData array for each pixel, 
 *     containing the pixel's index (x) and its RGB color components (r, g, b).
 * - console.table(pixelData);:
 *   - This line outputs the pixelData array to the console in a tabular 
 *     format, which can be used to visually inspect the RGB values of each 
 *     pixel.
 *
 * Input: filename, (err, data).
 *
 * Output: N/A.
 *
******************************************************************************/
readFile(filename, (err, data) => {
	if (err) throw err;

	const buffer = Buffer.from(data);
	const pixelData = [];

	for (let i = 0; i < buffer.length; i += 4) 
	{
		const y = buffer[i];
		const cb = buffer[i + 1];
		const cr = buffer[i + 2];
		const a = buffer[i + 3];
		const r = Math.max(0, Math.min(255, Math.round(y + 1.402 * (cr - 128))));
		const g = Math.max(0, Math.min(255, Math.round(y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128))));
		const b = Math.max(0, Math.min(255, Math.round(y + 1.772 * (cb - 128))));    
		pixelData.push({ x: i / 4, r, g, b });
	}

	console.table(pixelData);

	// Convert pixelData array into a string to save it
	const pixelDataString = pixelData.map(pixel => `x: ${pixel.x}, r: ${pixel.r}, g: ${pixel.g}, b: ${pixel.b}`).join('\n');

	// Write the string to a text file
	writeFile('pixelData.txt', pixelDataString, (writeErr) => {
		if (writeErr) throw writeErr;
		console.log('Saved pixel data to pixelData.txt');
	});
});