/******************************************************************************
* Class: Bird: Makes a bird that has a plethora of different functions, I.e.
* flapping wings, location detetction, custom flocking behaviour, etc.
*
* Input: None.
*
* Output: Bird with flight properties.
*
******************************************************************************/
class Bird
{
    /* Here we define a 2d array for the main array corresponding
    to the birds location (i.e. x,y,z). We also utilize Array.from() which allows us to create
    an array from an iterable. */
    static arrayMain = Array.from([
        [5,0,0],
        [-5, -2, 1],
        [-5, 0, 0],
        [-5, -2, -1],
        [0, 2, -6],
        [0, 2, 6],
        [2, 0, 0],
        [-3, 0, 0]
    ]);

    /* this static array serves to represent the indicies corresponding to a triangular mesh that makes
    the beak of the bird. */
    static birdBeak = Array.from([
        [0, 1, 2],
        [4, 7, 6],
        [5, 6, 7]
    ]);

    // Defines a fixed position vector in 3D space
    static myV = { x: 0, y: 0, z: 5000 };

    static myL = null;

    /******************************************************************************
    * Utility Function: definition: Copies properties and also methods from
    * protoProps and staticProps to the objects: className.prototype and className.
    * Lastly, the defined class is returned.
    *
    * Input: className, protoProps, staticProps.
    *
    * Output: className.
    *
    ******************************************************************************/
    static definition(className, protoProps, staticProps)
    {
        if (protoProps || staticProps) 
        {
            if (protoProps) 
            {
                this.copyProps(className.prototype, protoProps);
            }
            if (staticProps) 
            {
                this.copyProps(className, staticProps);
            }
        }        
        return className;
    }

    /******************************************************************************
    * Utility Function: copyProps: The following method iterates over all 
    * properties passed to the parameter via a for-in loop. Note that a for-in
    * loop iterates over enumerable, and of course non-symbol properties. The
    * method also copies all properties of the sourceObj into the targetObj.
    *
    * Input: targetObj, sourceObj.
    *
    * Output: targetObj.
    *
    ******************************************************************************/
    static copyProps(targetObj, sourceObj)
    {
        for (const prop in sourceObj)
        {
            // Ensures that the only properties directly defined on the object are copied
            if (Object.prototype.hasOwnProperty.call(p, prop))
            {
                targetObj[prop] = sourceObj[prop];
            }
        }
        return targetObj;
    }

    /******************************************************************************
    * Class: object: This class defines the behaviour of boids in three 
    * dimensional space. Note that boids is an algorithm for bird flocking. It
    * follows a simple set of rules: Coherence => Each boid will fly towards the
    * other boids in their vicinity, Seperation => The boids simultaneously try to
    * avoid collision with any other boid, and lastly, Alignment => Each boid will
    * try to match the speed and direction of any other boids in the nearby 
    * vicinity.
    *
    * Input: None.
    *
    * Output: Object for our bird.
    *
    ******************************************************************************/
    static object = Bird.definition(
        class
        {
            /******************************************************************************
            * Method: constructor: Initializes the properties to be used later on.
            *
            * Input: None.
            *
            * Output: Initialization of properties.
            *
            ******************************************************************************/
            constructor()
            {
                const maxSpeedThreshold = 4;
                const heightThreshold = 600;
                const widthThreshold = 600;
                const depthThreshold = 300;
                const collumnVal = false;
                const maxForceThreshold = 0.1;

                this.vector = new Bird.Vector3D(),
                this.height = heightThreshold, this.width = widthThreshold, 
                this.depth = depthThreshold, this.acceleration, 
                this.collumn = collumnVal, this.maxForceParam = maxForceThreshold, 
                this.maxSpeedParam = maxSpeedThreshold, 
                this.entityPerceptionThreshold, this.area;

                this.acceleration = new Bird.Vector3D();
                this.velocity = new Bird.Vector3D();
                this.position = new Bird.Vector3D();
            }

            /******************************************************************************
            * Method: coll: Sets the property collumn to the value of input, passed
            * into the parameter.
            *
            * Input: input.
            *
            * Output: Setting inputted value to this.collumn property.
            *
            ******************************************************************************/
            coll(input)
            {
                this.collumn = input;
            }

            /******************************************************************************
            * Method: parameters: Sets inputted values in the parameter to our predfined
            * position features. I.e. width, height, and depth.
            *
            * Input: width, height, depth.
            *
            * Output: Inputted values set to width, height, and depth.
            *
            ******************************************************************************/
            parameters(width, height, depth)
            {
                this.width = width;
                this.height = height;
                this.depth = depth;
            }

            /******************************************************************************
            * Method: running: The following method takes in a birdArray, then it checks 
            * whether or not the collumn is true or whether its false. If it happens to be
            * true, then we create an object with bird objects in it. Each key is iterated
            * through, and then retrives a vector corresponding to it, and subtly passes it
            * to birdDetection which will determine how the birds see and react around
            * eachother. Next, if collumn is false, we break out of the conditional and then
            * define a random number which is held against some threshold, if it exceeds said
            * threshold, then the flyMethod is called. Lastly, we update the position of
            * all birds in the birdArray via calling moveBirds().
            * 
            * Input: birdArray.
            *
            * Output: Updates properties of birds based on acceleration and nearby
            * detection.
            *
            ******************************************************************************/
            running(birdArray)
            {
                if (this.collumn)
                {
                    const collumnVectorArray = {
                        0: new Bird.Vector3D(-this.width, this.position.y, this.position.z),
                        1: new Bird.Vector3D(this.width, this.position.y, this.position.z),
                        2: new Bird.Vector3D(this.position.x, -this.height, this.position.z),
                        3: new Bird.Vector3D(this.position.x, this.height, this.position.z),
                        4: new Bird.Vector3D(this.position.x, this.position.y, -this.depth),
                        5: new Bird.Vector3D(this.position.x, this.position.y, this.depth)
                    };

                    Object.keys(collumnVectorArray).forEach(key => {
                        let collumnVector = collumnVectorArray[key];
                        let vector = this.birdDetection(collumnVector);
                        vector.scaleVectorUp(5);
                        this.acceleration.summation(vector);
                    });
                }

                const threshold = 0.5;
                if (Math.random() > threshold)
                {
                    this.flyMethod(birdArray);
                }
                this.moveBirds();
            }

            /******************************************************************************
            * Method: flyMethod: This method takes in array of our bird objects, and
            * updates the acceleration of the current bird based on the positions, and of
            * course movements of the other birds within the perception threshold.
            * 
            * Input: birdArray.
            *
            * Output: Updated acceleration of current bird.
            *
            ******************************************************************************/
            flyMethod(birdArray)
            {
                if (this.entityPerceptionThreshold)
                {
                    const threshold = 0.005;
                    this.acceleration.summation(this.meetAt(this.entityPerceptionThreshold, threshold));
                }
                this.acceleration.summation(this.lineFrom(birdArray));
                this.acceleration.summation(this.inConjunction(birdArray));
                this.acceleration.summation(this.seperate(birdArray));

                //Add some noise to the acceleration
                var noise = new Bird.Vector3D(Math.random() * 2 - 1, Math.random() * 2 - 1);
                noise.scaleVectorUp(0.2);
                this.acceleration.summation(noise);
            }

            /******************************************************************************
            * Method: moveBirds: The following method updates the position of the bird
            * object based off of its current velocity and acceleration.
            * 
            * Input: None.
            *
            * Output: Updated bird object position.
            *
            ******************************************************************************/
            moveBirds()
            {
                //Compute Velocity based on the accerleration at the given moment
                let newVelocity = this.velocity.clone().summation(this.acceleration);

                //Limit the magnitude of the velocity to the maximum speed at the current moment
                let limitingFactor = newVelocity.getLength();
                if (limitingFactor > this.maxSpeedParam)
                {
                    newVelocity.scaleVectorDown(limitingFactor / this.maxSpeedParam);
                }

                //Update the position based on the newely defined velocity
                this.position.summation(newVelocity);

                //Reset the acceleration
                this.acceleration.setMethod(0, 0, 0);

                //Update the velocity to the new value
                this.velocity = newVelocity;
            }

            /******************************************************************************
            * Method: birdDetection: This method serves to calculate the direction vector
            * in relation to the birds current position at a given point.
            *  
            * Input: point.
            *
            * Output: Updated direction vector for bird object.
            *
            ******************************************************************************/
            birdDetection(point)
            {
                var direction = new Bird.Vector3D();
                direction.clone(this.position);
                direction.subtract(point);
                var distanceSquared = this.position.getDistance(point, true);
                if (distanceSquared !== 0)
                {
                    direction.scaleVectorDown(distanceSquared);
                }
                return direction;
            }

            /******************************************************************************
            * Method: repulsion: The followinmg method computes a repulsive force on the
            * bird object which is calculated based on the distance between the birds
            * position and a given point passed as an argument.
            *   
            * Input: point.
            *
            * Output: Calculates the repulsive force.
            *
            ******************************************************************************/
            repulsion(point)
            {
                var distance = this.position.getDistance(point, false);
                if (distance < 150)
                {
                    var direction = new Bird.Vector3D();
                    direction.subtractVectors(this.position, point);
                    direction.scaleVectorUp(0.5 / distance);
                    this.acceleration.summation(direction);
                }
            }

            /******************************************************************************
            * Method: meetAt: The following method returns a three dimensional object that
            * serves to represent the direction from the point to the current bird object.
            * A given magnitude is then multiplied, and thus the resultant vector can be
            * adjusted in relation to the birds acceleration and the specified point.
            *    
            * Input: point, magnitude.
            *
            * Output: Returns the updated dirtection vector.
            *
            ******************************************************************************/
            meetAt(point, magnitude)
            {
                var direction = new Bird.Vector3D();
                direction.subtractVectors(point, this.position);
                direction.scaleVectorUp(magnitude);
                return direction;
            }

            /******************************************************************************
            * Method: lineFrom: By calculating the average velocity of nearby birds within a 
            * given region, the lineFrom method determines a bird's alignment behaviour. 
            * The total velocity and the number of birds that are within a specific range 
            * (this.area) from the current bird's location are calculated using an array 
            * of birds as input and iteratively going through each bird's position and 
            * velocity. The average velocity is then calculated by dividing the overall 
            * velocity by the quantity of nearby birds. The average velocity is scaled 
            * down to match the maximum force if the current bird's velocity surpasses a 
            * maximum force (this.maxForceParam). The method then gives the computed total 
            * velocity, which is used to modify the acceleration of the current bird.
            * 
            * Input: birdArray.
            *
            * Output: Returns the totalVelocity.
            *
            ******************************************************************************/
            lineFrom(birdArray)
            {
                var count = 0;
                var totalVelocity = new Bird.Vector3D();

                //The location and velocity of each bird are subjected to some logic as this code iterates through an array of birds.
                birdArray.forEach(function(_birdArray) {
                    const threshold = 0.6;
                    if (Math.random() > threshold)
                        return;
                    var distance = _birdArray.position.getDistance(this.position, false);
                    if (distance > 0 && distance <= this.area)
                    {
                        totalVelocity.summation(_birdArray.velocity);
                        count++;
                    }
                }, this);

                if (count > 0)
                {
                    totalVelocity.scaleVectorDown(count);
                    var velocityCurrent = totalVelocity.getLength();
                    if (velocityCurrent > this.maxForceParam)
                    {
                        totalVelocity.scaleVectorDown(velocityCurrent / this.maxForceParam);
                    }
                }
                return totalVelocity;
            }

            /******************************************************************************
            * Method: inConjunction: The inConjunction method determines the way the bird 
            * should fly in order to line up with other nearby birds. It accomplishes this 
            * by repeatedly traversing an array of birds, checking each one's proximity to 
            * the present bird (this) and its probability of occurring within a given range 
            * of probabilities (specified by threshold). The count variable is increased and 
            * the location of the bird is added to an addition vector if it satisfies these 
            * requirements. The addition vector is divided by the count to determine the 
            * average location of all nearby birds after each bird has been checked. After 
            * that, a calculation is made to determine the current bird's direction in 
            * relation to this average location. This direction's length is scaled down to 
            * that length if it surpasses the maximum force parameter (this.maxForceParam).
            *    
            * Input: birdArray.
            *
            * Output: Returns the updated dirtection vector.
            *
            ******************************************************************************/
            inConjunction(birdArray)
            {
                var distance, _birdArray, count = 0, direction = new Bird.Vector3D(), addition = new Bird.Vector3D(), distance;
                birdArray.forEach(function(bird) {
                    const threshold = 0.6;
                    if (Math.random() > threshold)
                        return;
                    _birdArray = bird;
                    distance = _birdArray.position.getDistance(this.position, false);
                    if (distance > 0 && distance <= this.area)
                    {
                        addition.summation(_birdArray.position);
                        count++;
                    }
                }, this);
                if (count > 0)
                {
                    addition.scaleVectorDown(count);
                }
                direction.subtractVectors(addition, this.position);
                var length = direction.getLength();
                if (length > this.maxForceParam)
                {
                    direction.scaleVectorDown(length / this.maxForceParam);
                }
                return direction;
            }

            /******************************************************************************
            * Method: seperate: A bird will prevent getting too near to other birds in the 
            * bird array by engaging in the separate method, which is a behaviour. It 
            * accepts an array of birds as a parameter and computes the separation between 
            * each bird's position and the other bird's position for each bird in the array. 
            * It generates a repulsion vector that points away from the location of the 
            * other bird, levels it out (sets the y-component to 0), and scales it down in 
            * accordance with the distance between the two birds if the distance is less 
            * than or equal to a predetermined area. The final addition vector, which is 
            * then returned, is created by adding the repulsion vectors from all the birds 
            * in the designated region.
            *    
            * Input: birdArray.
            *
            * Output: Returns the updated addition vector.
            *
            ******************************************************************************/
            seperate(birdArray)
            {
                let addition = new Bird.Vector3D();
                birdArray.forEach((_birdArray) => {
                    const threshold = 0.6;
                    if (Math.random() > threshold)
                        return;
                    let distance = _birdArray.position.getDistance(this.position, false);
                    if (distance > 0 && distance <= this.area)
                    {
                        let repulsion = new Bird.Vector3D();
                        repulsion.subtractVectors(this.position, _birdArray.position);
                        repulsion.levelOut();
                        repulsion.scaleVectorDown(distance);
                        addition.summation(repulsion);
                    }
                });
                return addition;
            }
        },
        {}
    );

    /******************************************************************************
    * Class: birdBuild: Using Bird.definition, this code creates a class called 
    * birdBuild in the Bird scope (). Position, foundation, right, left, 
    * birdLeftWing, birdRightWing, _foundation, and rotation are among the 
    * properties defined by the class' function Object() { [native code] }. 
    * Additionally, the class specifies a number of functions, such as birdMatrix(), 
    * draw(), triangular(), atan2(), wingAngle(), zPosition(), and wing ().
    *
    * Input: None.
    *
    * Output: Build for our bird.
    *
    ******************************************************************************/
    static birdBuild = Bird.definition(
        class
        {
            /******************************************************************************
            * Method: constructor: Initializes the properties to be used later on.
            *
            * Input: None.
            *
            * Output: Initialization of properties.
            *
            ******************************************************************************/
            constructor()
            {
                this.position = new Bird.Vector3D();
                this.foundation = 0;
                this.right = 2;
                this.left = 1;
                this.birdLeftWing = this.triangular(this.left);
                this.birdRightWing = this.triangular(this.right);
                this._foundation = this.triangular(this.foundation);
                this.rotation = new Bird.Vector3D();
            }

            /******************************************************************************
            * Method: birdMatrix: In order to determine the bird's ultimate location and 
            * orientation, the birdMatrix() method performs a number of transformations on 
            * the bird's body and wings.
            *    
            * Input: None.
            *
            * Output: Returns birds ultimate location.
            *
            ******************************************************************************/
            birdMatrix()
            {
                const objects = [this._foundation, this.birdLeftWing, this.birdRightWing];

                //Apply vertex transformation to all objects
                objects.forEach((obj) => obj.vertex());

                //Apply yWing transformation to both wings
                objects.slice(1).forEach((wing) => wing.yWing(this.theWingY));

                //Apply rotation for all objects
                objects.forEach((obj) => {
                    obj.rotateAlongY(this.rotation.y);
                    obj.rotateAlongZ(this.rotation.z);
                });

                //Apply translation to all objects
                objects.forEach((obj) => obj.translate(this.position));
            }

            /******************************************************************************
            * Method: draw: calls the draw() function on every object that makes up the
            * bird, including the _foundation, birdLeftWing, and birdRightWing objects.
            *    
            * Input: None.
            *
            * Output: Draws the bird.
            *
            ******************************************************************************/
            draw()
            {
                const objects = [this._foundation, this.birdLeftWing, this.birdRightWing];

                //Call draw method for each object
                objects.forEach((obj) => obj.draw());
            }

            /******************************************************************************
            * Method: triangular: The index of the Bird.birdBeak array is provided as an 
            * input parameter to the triangular(input) function. Using the input index, it 
            * then extracts the triangle's three vertices from Bird.birdBeak, and for each 
            * vertex, it generates a new Bird.Vector3D instance using the corresponding 
            * values in the Bird.arrayMain array. The procedure then returns a fresh Bird. 
            * built as a triangular instance from its three vertices.
            *    
            * Input: input.
            *
            * Output: Beak structure.
            *
            ******************************************************************************/
            triangular(input)
            {
                const [input0, input1, input2] = Bird.birdBeak[input];
                const [vertex1, vertex2, vertex3] = [input0, input1, input2].map((index) => new Bird.Vector3D(...Bird.arrayMain[index]));
                return new Bird.Triangular(vertex1, vertex2, vertex3);
            }

            /******************************************************************************
            * Mathod: Atan2: The method implements a custom atan2 function. Which is
            * responsible for determining the arctangent of the coordinates y and x, then
            * returns the angle in radians.
            *
            * Input: y and x.
            *
            * Output: The angle in radians.
            *
            ******************************************************************************/
            atan2(y, x)
            {
                const epsilon = 1e-16;
                let angle = 0;

                if (Math.abs(x) < epsilon)
                {
                    if (y > 0)
                    {
                        angle = Math.PI / 2;
                    }
                    else if (y < 0)
                    {
                        angle = -Math.PI / 2;
                    }
                }
                else if (x > 0)
                {
                    /* Math.atan entails that if tan(y) = x, then tan^{-1}(x) = y which is
                    within the bounds [-\frac{\pi}{2}, \frac{\pi}{2}]. */
                    angle = Math.atan(y / x);
                }
                else if (x < 0 && y >= 0)
                {
                    angle = Math.atan(y / x) + Math.PI;
                }
                else if (x < 0 && y < 0)
                {
                    angle = Math.atan(y / x) - Math.PI;
                }
                return angle;
            }

            /******************************************************************************
            * Mathod: wingAngle: Based on the input y value, the wingAngle(y) function 
            * determines the angle by which the bird's wings should be rotated around the 
            * x-axis.
            *
            * Input: y.
            *
            * Output: Angle by which wing should be rotated.
            *
            ******************************************************************************/
            wingAngle(y)
            {
                try
                {
                    const [,,vertex1x] = Bird.arrayMain[Bird.birdBeak[1][1]];
                    this.rotation.x = atan2(y, vertex1x);
                }
                catch(error)
                {
                    console.log(error);
                    const [,,vertex1x] = Bird.arrayMain[Bird.birdBeak[1][1]];
                    this.rotation.x = Math.atan2(y, vertex1x);
                }
            }

            /******************************************************************************
            * Mathod: zPosition: The foundation, left wing, and right wing's minimum 
            * z-positions are determined by the zPosition method, which calculates and gives 
            * the value. This is accomplished by using the getMinimumZ method to obtain the 
            * lowest z-position of each wing and storing the results in an array. The 
            * smallest number in the array, which corresponds to the bird's minimum 
            * z-position, is then found using the Math.min function. The technique takes for 
            * granted that the wings are vertically oriented and that the bird's z-position 
            * is constant across all of its wings.
            *
            * Input: None.
            *
            * Output: Minimum z-position of the three wings.
            *
            ******************************************************************************/
            zPosition()
            {
                const wings = [this._foundation, this.birdLeftWing, this.birdRightWing];
                const [z1, z2, z3] = wings.map(wing => wing.getMinimumZ());
                return Math.min(...[z1, z2, z3]);
            }

            /******************************************************************************
            * Mathod: wing: This method changes the Bird object's theWingY property's value 
            * to the given y value. The left and right wings of the bird are translated 
            * along the y-axis using the theWingY property in the birdMatrix() function.
            *
            * Input: y.
            *
            * Output: Changed this.theWingY set to inputted y value.
            *
            ******************************************************************************/
            wing(y)
            {
                this.theWingY = y;
            }
        },
        {}
    );

    /******************************************************************************
    * Class: Triangular: Within the Bird class, this code creates an immutable 
    * class called Triangular. A 3D triangle form that can be rendered on a canvas 
    * can be created and modified using a number of the Triangular class's methods 
    * and properties.
    *
    * Input: None.
    *
    * Output: Bird wing structure.
    *
    ******************************************************************************/
    static Triangular = Bird.definition(
        class
        {
            /******************************************************************************
            * Method: constructor: Initializes the properties to be used later on.
            *
            * Input: None.
            *
            * Output: Initialization of properties.
            *
            ******************************************************************************/
            constructor(p1, p2, p3)
            {
                const thresholdOne = 0.5;
                const thresholdTwo = 0.8;
                this.birdvertex = new Bird.Vector3D(thresholdOne, thresholdOne, thresholdTwo);
                this.verticies = [p1.clone(), p2.clone(), p3.clone()];
                this.mainVertex = [p1.clone(), p2.clone(), p3.clone()];
            }

            /******************************************************************************
            * Method: draw: On a canvas, a triangular form is created using this technique. 
            * It begins by calling the getPoint() method on each vertex object and then 
            * pushing the returned x and y values to the array in order to build an array 
            * of the triangle's vertices' x and y coordinates. The line width is then 
            * changed to 0.1, a new path is started, and the cursor moves to the first 
            * vertex of the triangle. The fill style and stroke style are then set to the 
            * colour returned by the theCollumn() function. The lineTo() function is then 
            * used to connect every pair of adjacent x and y values in the array as it 
            * iterates through the verticiesArray. The triangle on the canvas context is 
            * filled and stroked before the route is closed.
            *
            * Input: None.
            *
            * Output: Draws the actual wings on the canvas.
            *
            ******************************************************************************/
            draw()
            {
                let verticiesArray = this.verticies.reduce((arr, vertex) => {
                    arr.push(vertex.getPoint().x);
                    arr.push(vertex.getPoint().y);
                    return arr;
                }, []);

                let collumn = this.theCollumn();
                Bird.$.fillStyle = collumn;
                Bird.$.strokeStyle = collumn;
                Bird.$.lineWidth = 0.1;
                Bird.$.beginPath();
                Bird.$.moveTo(verticiesArray[0], verticiesArray[1]);
                verticiesArray.forEach((value, index) => {
                    if (index % 2 !== 0)
                    {
                        Bird.$.lineTo(verticiesArray[index - 1], value);
                    }
                });               
                Bird.$.closePath();
                Bird.$.fill();
                Bird.$.stroke();
            }

            /******************************************************************************
            * Method: rotateAlongX: The rotateAlongX(angle) method turns the bird object by 
            * the specified angle in radians around the X-axis. This is accomplished by 
            * calling the Bird.birdMatrix.rotateAlongX(e, theAngle) function on the vertex 
            * e and the angle theAngle after iterating through each vertex in the 
            * this.verticies array. This technique rotates the vertex e around the X-axis 
            * by the specified angle by applying a rotation matrix to it. The complete 
            * object is rotated around the X-axis by invoking this method on each of the 
            * object's vertices representing the bird.
            *
            * Input: angle.
            *
            * Output: Rotated bird along specified angle on the x-axis.
            *
            ******************************************************************************/
            rotateAlongX(angle)
            {
                var theAngle = angle;
                this.verticies.forEach(function(e) {
                    Bird.birdMatrix.rotateAlongX(e, theAngle);
                });
            }

            /******************************************************************************
            * Method: rotateAlongY: A collection of 3D vertices are rotated using the 
            * rotateAlongY(angle) method, which is a function that is stored in the 
            * this.vertices array. The rotation is performed at an angle determined by the 
            * angle parameter around the Y-axis.
            * 
            * Input: angle.
            *
            * Output: Rotated bird along specified angle on the y-axis.
            *
            ******************************************************************************/
            rotateAlongY(angle)
            {
                var theAngle = angle;
                this.verticies.forEach(function(e) {
                    Bird.birdMatrix.rotateAlongY(e, theAngle);
                });
            }

            /******************************************************************************
            * Method: rotateAlongZ: Using the rotateAlongZ method of the birdMatrix object, 
            * the rotateAlongZ method is a function of an object that accepts an angle as 
            * an argument and turns the object's 3D vertices around the z-axis by that 
            * angle.
            * 
            * Input: angle.
            *
            * Output: Rotated bird along specified angle on the z-axis.
            *
            ******************************************************************************/
            rotateAlongZ(angle)
            {
                var theAngle = angle;
                this.verticies.forEach(function(e) {
                    Bird.birdMatrix.rotateAlongZ(e, theAngle);
                });
            }

            /******************************************************************************
            * Method: translate: Each vertex of the object is translated by a 3D vector 
            * represented by the phi parameter using the translate(phi) function.
            * 
            * Input: phi.
            *
            * Output: Translation of each vertex.
            *
            ******************************************************************************/
            translate(phi)
            {
                var translate = phi;
                this.verticies.forEach(function(e) {
                    Bird.birdMatrix.translate(e, [translate.x, translate.y, translate.z]);
                });
            }

            /******************************************************************************
            * Method: vertex: The mainVertex array's values are used by the vertex() 
            * function to set the object's vertices' x, y, and z coordinates. The mainVertex 
            * array is iterated over in order to accomplish this, and the vertices in the 
            * verticies array are then given the appropriate x, y, and z values.
            * 
            * Input: None.
            *
            * Output: Sets Birds verticies.
            *
            ******************************************************************************/
            vertex()
            {
                this.mainVertex.forEach((v, i) => {
                    this.verticies[i].x = v.x;
                    this.verticies[i].y = v.y;
                    this.verticies[i].z = v.z;
                });
            }

            /******************************************************************************
            * Method: yWing: The yWing() function changes the first vertex's y coordinate 
            * in the verticies array to the specified value y.
            * 
            * Input: None.
            *
            * Output: Sets Birds verticies.
            *
            ******************************************************************************/
            yWing(y)
            {
                this.verticies.forEach((vertex, i) => {
                    if (i === 0)
                    {
                        vertex.y = y;
                    }
                });
            }

            /******************************************************************************
            * Method: getMinimumZ: Returns the smallest number for each vertex's z property 
            * from a collection of vertices.
            * 
            * Input: None.
            *
            * Output: Smallest z value from verticies.
            *
            ******************************************************************************/
            getMinimumZ()
            {
                return Math.min(...this.verticies.map(vertex => vertex.z));
            }

            //need to change a lil more
            /******************************************************************************
            * Method: theCollumn: Determines a bird object's colour based on its location 
            * and orientation in relation to the observer.
            * 
            * Input: None.
            *
            * Output: Bird color.
            *
            ******************************************************************************/
            theCollumn()
            {
                const e = 0.3, f = 0.3, g = 0.7;
                const bw = new Bird.Vector3D(1, 1, 1);
                const n = this.normalize();
                const v = this.verticies[0].clone().subtract(Bird.myV).levelOut();
                const l = this.verticies[0].clone().subtract(Bird.myL).levelOut();
                const p = l.dotProduct(n);
                const x1 = n.clone().scaleVectorUp(p * 2);
                const r = l.clone().subtract(x1).scaleVectorUp(-1);
                const col = this.birdvertex.clone().scaleVectorUp(p * e);
                const x2 = bw.clone().scaleVectorUp(Math.pow(Math.max(r.clone().scaleVectorUp(-1).dotProduct(v), 0), 20) * f);
                const x3 = this.birdvertex.clone().scaleVectorUp(g);
                const x1_add = x2.summation(x3);
                const x1_result = col.summation(x1_add);
                //Here is where I could have the neon bird effect
                const rgb = Object.keys(x1_result).reduce((acc, key) => {
                    acc.push(Math.floor(x1_result[key] * 255));
                    return acc;
                }, []).join(',');

                return `rgb(${rgb})`;
            }

            /******************************************************************************
            * Method: normalize: Determines a normalised vector that depicts a triangle's 
            * direction in three dimensions.
            * 
            * Input: None.
            *
            * Output: Traingle direction.
            *
            ******************************************************************************/
            normalize()
            {
                var v1 = this.verticies[0];
                var v2 = this.verticies[1];
                var v3 = this.verticies[2];
                
                v3.subtract(v2);
                v1.subtract(v3);
                v3.crossProduct(v1);
                v3.levelOut();
                return v3;
            }
        },
        {}
    );

    /******************************************************************************
    * Class: Vector3D: Creates methods used in linear algebra to manipulate, and
    * garner information from vector math.
    *
    * Input: None.
    *
    * Output: 3D vector math.
    *
    ******************************************************************************/
    static Vector3D = Bird.definition(
        class
        {
            /******************************************************************************
            * Method: constructor: Initializes the properties to be used later on.
            *
            * Input: None.
            *
            * Output: Initialization of properties.
            *
            ******************************************************************************/
            constructor(x, y, z)
            {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
                this.fl = 1000;
            }

            /******************************************************************************
            * Method: getPoint: based on the viewer's location and the point's 3D 
            * coordinates, determines the point's scale factor and 2D screen coordinates.
            *
            * Input: None.
            *
            * Output: Points coordinates.
            *
            ******************************************************************************/
            getPoint()
            {
                const { x, y } = this;
                const zsc = this.fl + this.z;
                const scale = this.fl / zsc;
                return { x, y, scale: scale };
            }

            /******************************************************************************
            * Method: setMethod: An object's x, y, and z properties are set to the numbers 
            * provided as arguments, and the modified object is returned.
            *
            * Input: x,y, z.
            *
            * Output: Sets the x,y, and z properties of a vector.
            *
            ******************************************************************************/
            setMethod(x, y, z)
            {
                const values = {x, y, z};
                Object.keys(values).forEach(key => {
                    this[key] = values[key];
                });
                return this;
            }

            /******************************************************************************
            * Method: getLength: Determines the vector's length, also referred to as its 
            * magnitude or norm and reflected by the object's x, y, and z properties.
            *
            * Input: None.
            *
            * Output: Length/Magnitude.
            *
            ******************************************************************************/
            getLength()
            {
                return [this.x, this.y, this.z].reduce((acc, val) => acc + val ** 2, 0) ** 0.5;
            }

            /******************************************************************************
            * Method: summation: Combines a vector with a different vector v and then gives 
            * the resulting vector.
            * 
            * Input: v.
            *
            * Output: vector resulting from sum.
            *
            ******************************************************************************/
            summation(v)
            {
                Object.keys(v).forEach(key => {
                    this[key] += v[key];
                });
                return this;
            }

            /******************************************************************************
            * Method: subtract: Subtracts a vector with a different vector v and then gives 
            * the resulting vector.
            * 
            * Input: v.
            *
            * Output: vector resulting from subtraction.
            *
            ******************************************************************************/
            subtract(v)
            {
                Object.keys(v).forEach(key => {
                    this[key] -= v[key];
                });
                return this;
            }

            /******************************************************************************
            * Method: subtractVectors: Subtracts two vectors directly, and returns new 
            * vector.
            * 
            * Input: a and b.
            *
            * Output: vector resulting from subtraction.
            *
            ******************************************************************************/
            subtractVectors(a, b)
            {
                this.setMethod(a.x - b.x, a.y - b.y, a.z - b.z);
                return this;
            }

            /******************************************************************************
            * Method: scaleVectorUp: Scales the vector the object represents by a 
            * specified number upd and returns the new vector.
            * 
            * Input: upd.
            *
            * Output: scaled up vector.
            *
            ******************************************************************************/
            scaleVectorUp(upd)
            {
                Object.keys(this).forEach(key => {
                    if (key === 'x' || key === 'y' || key === 'z')
                    {
                        this[key] *= upd;
                    }
                });
                return this;
            }

            /******************************************************************************
            * Method: scaleVectorDown: Divides the vector that the object represents by the 
            * given factor upd, essentially scaling the vector that the object represents. 
            * The outcome vector is then returned by the function.
            * 
            * Input: upd.
            *
            * Output: Scaled down vector.
            *
            ******************************************************************************/
            scaleVectorDown(upd)
            {
                if (upd !== 0)
                {
                    var inverse = 1 / upd;
                    Object.keys(this).forEach(key => {
                        if (key === 'x' || key === 'y' || key === 'z')
                        {
                            this[key] *= inverse;
                        }
                    });
                }
                else
                {
                    Object.keys(this).forEach(key => {
                        if (key === 'x' || key === 'y' || key === 'z')
                        {
                            this[key] = 0;
                        }
                    });
                }
                return this;
            }

            /******************************************************************************
            * Method: clone: The same values from an existing vector v are used to make a 
            * new instance of the vector. The method calls a new instance of the vector on 
            * which the x, y, and z values of the provided vector v are copied. The initial 
            * vector v or any other vector are not changed by the method.
            * 
            * Input: v.
            *
            * Output: Copied Vector.
            *
            ******************************************************************************/
            clone(v)
            {
                Object.keys(v).forEach(key => {
                    if (key === 'x' || key === 'y' || key === 'z')
                    {
                        this[key] = v[key];
                    }
                });
                return this;
            }

            /******************************************************************************
            * Method: getDistance: Calculates the separation between the v vector that 
            * called the function and the v vector that was passed. If the squared parameter 
            * is set to false, it gives the actual distance rather than the squared value,
            * which is what it does by default.
            * 
            * Input: v, squared set to true.
            *
            * Output: Squared distance or regular distance.
            *
            ******************************************************************************/
            getDistance(v, squared = true)
            {
                const distanceSquared = Object.keys(this).reduce((acc, key) => {
                    if (key === 'x' || key === 'y' || key === 'z')
                    {
                        const delta = this[key] - v[key];
                        return acc + Math.pow(delta, 2);
                    }
                    return acc;
                }, 0);

                return squared ? distanceSquared : Math.sqrt(distanceSquared);
            }
            
            /******************************************************************************
            * Method: crossProduct: The vector object that the crossProduct method is 
            * called on is used to compute the cross product of two vectors and store the 
            * result. A vector that is perpendicular to both u and v and whose magnitude is 
            * equal to the area of the parallelogram made by u and v is created by taking 
            * the cross product of two vectors, u and v. In this instance, the method 
            * determines the cross product of the vector object that the method is called on 
            * with a parameter named v. The received vector object is a representation of 
            * the cross product. The implementation determines each cross product component 
            * by applying the following formula to each of the three elements of the vector 
            * (x, y, and z) in turn: ux*vy - uy*vx = (uy*vz - uz*vy)i + (uz*vx - ux*vz)j + 
            * The fundamental vectors of the Cartesian coordinate system are I j, and k. 
            * The method is performed on a vector object, which stores the calculated 
            * components, and returns a new vector object.
            * 
            * Input: v.
            *
            * Output: The resultant vector with new calculated components.
            *
            ******************************************************************************/
            crossProduct(v)
            {
                const x = this.x;
                const y = this.y;
                const z = this.z;

                Object.keys(this).forEach(key => {
                    if (key === 'x')
                    {
                        this[key] = y * v.z - z * v.y;
                    } 
                    else if (key === 'y')
                    {
                        this[key] = z * v.x - x * v.z;
                    }
                    else if (key === 'z')
                    {
                        this[key] = x * v.y - y * v.x;
                    } 
                });
                return this;
            }

            /******************************************************************************
            * Method: dotProduct: With this technique, the present vector's dot product 
            * with another vector v is calculated. The sum of the products of the respective 
            * components of two vectors is known as the dot product.
            * 
            * Input: v.
            *
            * Output: The resultant vector after dot product calculation has been 
            * completed.
            *
            ******************************************************************************/
            dotProduct(v)
            {
                let result = 0;
                Object.keys(this).forEach(key => {
                    if (key === 'x' || key === 'y' || key === 'z')
                    {
                        const vKey = `v.${key}`;
                        result += this[key] * eval(`${vKey}`);
                    }
                });
                return result;
            }

            /******************************************************************************
            * Method: levelOut: By using the getLength() method to determine the length of 
            * the vector and the scaleVectorDown() method to divide each component by that 
            * length, the levelOut() method reduces the vector's length to 1, essentially 
            * normalising it. By doing this, the vector is guaranteed to have the same 
            * length and direction, which is advantageous for various calculations in 
            * linear algebra, computer graphics, and other areas. After normalising the 
            * vector, the function returns the vector itself, allowing it to be combined 
            * with other vector methods.
            * 
            * Input: None.
            *
            * Output: Leveled out vector.
            *
            ******************************************************************************/
            levelOut()
            {
                return this.scaleVectorDown(this.getLength());
            }

            /******************************************************************************
            * Method: clone: Similar to other clone method; however, this one returns a
            * new vector.
            * 
            * Input: None.
            *
            * Output: New vector with x,y, z coordinates.
            *
            ******************************************************************************/
            clone()
            {
                return new Bird.Vector3D(this.x, this.y, this.z);
            }
        },
        {}
    );
}

/******************************************************************************
* Function: birdMatrix: Several methods associated to the bird for rotating, 
* translating, and scaling points in three-dimensional space.
*
* Input: None.
*
* Output: Matrix in association to bird.
*
******************************************************************************/
Bird.birdMatrix = {
    /******************************************************************************
    * Methods: rotateAlongX, rotateAlongY, and rotateAlongZ: The rotateAlongX, rotateAlongY, and rotateAlongZ methods, 
    * respectively, revolve a specified point (pt) by a specified angle around the 
    * x, y, or z axes (angX, angY, or angZ). A rotation matrix and matrix 
    * multiplication are used to accomplish the rotation.
    * 
    * Input: pt, angX.
    *
    * Output: Rotation matricies.
    *
    ******************************************************************************/
    rotateAlongX: function(pt, angX)
    {
        var position = [pt.x, pt.y, pt.z];
        var asin = Math.sin(angX);
        var acos = Math.cos(angX);
        var xrot = {
            0: { 0: 1, 1: 0, 2: 0 },
            1: { 0: 0, 1: acos, 2: asin },
            2: { 0: 0, 1: -asin, 2: acos }
        };

        Object.keys(xrot).forEach(function(i) {
            var row = xrot[i];
            var result = 0;
            Object.keys(row).forEach(function(j) {
                result += position[j] * row[j];
            });
            pt[i] = result;
        });
    },
    rotateAlongY: function(pt, angY)
    {
        var position = [pt.x, pt.y, pt.z];
        var asin = Math.sin(angY);
        var acos = Math.cos(angY);
        var yrot = [];
        yrot[0] = [acos, 0, asin];
        yrot[1] = [0, 1, 0];
        yrot[2] = [-asin, 0, acos];
        var calc = this.matrixMultiplication(position, yrot);

        Object.keys(pt).forEach(key => {
            pt[key] = calc[key.toLowerCase().charCodeAt(0) - 120];
        });
    },
    rotateAlongZ: function(pt, angZ)
    {
        var position = [pt.x, pt.y, pt.z];
        var asin = Math.sin(angZ);
        var acos = Math.cos(angZ);
        var zrot = [];
        zrot[0] = [acos, asin, 0];
        zrot[1] = [-asin, acos, 0];
        zrot[2] = [0, 0, 1];

        Object.keys(position).forEach(i => {
            var calc = 0;
            Object.keys(zrot[i]).forEach(j => {
                calc += zrot[i][j] * position[j];
            });
            pt[i] = calc;
        });
    },
    /******************************************************************************
    * Method: translate: The translate method translates a given point (pt) by a 
    * given amount (s) along each of the three axes.
    * 
    * Input: pt, s.
    *
    * Output: Translation of a given point.
    *
    ******************************************************************************/
    translate: function(pt, s)
    {
        [s[0], s[1], s[2]].forEach((value, index) => {
            pt[index === 0 ? 'x' : index === 1 ? 'y' : 'z'] += value;
        });
    },
    /******************************************************************************
    * Method: setScale: The setScale method scales a given point (pt) along each 
    * of the three axes by a given amount (s).
    * 
    * Input: pt, s.
    *
    * Output: Scales by a given amount.
    *
    ******************************************************************************/
    setScale: function(pt, s)
    {
        const scaleFactors = [s[0], s[1], s[2]];
        const ptKeys = Object.keys(pt);

        ptKeys.forEach(key => {
            pt[key] *= scaleFactors[ptKeys.indexOf(key)];
        });
    },
    /******************************************************************************
    * Method: matrixMultiplication: The matrixMultiplication method performs 
    * matrix multiplication between two matrices (m1 and m2).
    * 
    * Input: m1, m2.
    *
    * Output: Multiplied matrix.
    *
    ******************************************************************************/
    matrixMultiplication: function(m1, m2)
    {
        var calc = [];
        m2.forEach(function(row, i) {
            var sum = 0;
            row.forEach(function(val, j) {
                sum += m1[j] * val;
            });
            calc[i] = sum;
        });
        return calc;
    }
}

/******************************************************************************
* Function: draw: The draw() function, which is defined in this code, carries 
* out a number of tasks to render a 3D flock of birds on an HTML canvas. The 
* canvas element with the id canv is first retrieved from the DOM, the canvas 
* context is changed to 2D, and the canvas dimensions are set to the window 
* dimensions. The phase property of each bird is defined as a random number 
* between 0 and 62.83, and after that, an array of 100 bird objects with 
* random positions and velocities is created. The run() method is then 
* invoked, and it is specified to use window to call the draw() function. 
* requestAnimationFrame(). The canvas is translated to the screen's centre, 
* it is cleared, and the Y-axis is turned around inside the draw() method. 
* Then, after iterating over each bird object in the birdArray, it draws the 
* bird on the canvas by rotating it according to its velocity and updating its 
* location based on that velocity and the positions of the other birds in the 
* flock. The birds are drawn in the sequence of their depth and arranged 
* according to their z positions.
* 
* Input: None.
*
* Output: Flocking birds.
*
******************************************************************************/
function draw()
{
    var c = document.getElementById('canv');
    Bird.$ = c.getContext("2d");
    Bird.canv = {
        w: c.width = window.innerWidth,
        h: c.height = window.innerHeight
    };
    Bird.myL = new Bird.Vector3D(0, 2000, 5000);
    Bird.myV = new Bird.Vector3D(0, 0, 5000);
    var birds = [];
    var birdArray = [];
    for (var i = 0; i < 100; i++)
    {
        _birdArray = birdArray[i] = new Bird.object();
        _birdArray.position.x = Math.random() * 800 - 400;
        _birdArray.position.y = Math.random() * 800 - 400;
        _birdArray.position.z = Math.random() * 800 - 400;
        _birdArray.velocity.x = Math.random() * 2 - 1;
        _birdArray.velocity.y = Math.random() * 2 - 1;
        _birdArray.velocity.z = Math.random() * 2 - 1;
        _birdArray.coll(true);
        _birdArray.parameters(400, 400, 800);
        bird = birds[i] = new Bird.birdBuild();
        bird.phase = Math.floor(Math.random() * 62.83);
        bird.position = birdArray[i].position;
    }

    run();

    function run()
    {
        window.requestAnimationFrame(run);
        draw();
    }

    function draw() 
    {
        Bird.$.setTransform(1, 0, 0, 1, 0, 0);
        Bird.$.translate(Bird.canv.w / 2, Bird.canv.h / 2);
        Bird.$.clearRect(-Bird.canv.w / 2, -Bird.canv.h / 2, Bird.canv.w, Bird.canv.h);
        Bird.$.scale(1, -1);
        var arr = [];
        birdArray.forEach(function(_birdArray, i) 
        {
            _birdArray.running(birdArray);
            var bird = birds[i];
            bird.rotation.y = Math.atan2(-_birdArray.velocity.z, _birdArray.velocity.x);
            bird.rotation.z = Math.asin(_birdArray.velocity.y / _birdArray.velocity.getLength());
            bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
            bird.wing(Math.sin(bird.phase) * 5);
            bird.birdMatrix();
            arr.push({
                z: bird.zPosition(),
                o: bird
            });
        });
        arr.sort(function(a, b) {
            return a.z < b.z ? -1 : a.z > b.z ? 1 : 0;
        });
        arr.forEach(function(e) {
            e.o.draw();
        });
    };      
};
draw();
window.addEventListener('resize', function() {
    if(c.width !== window.innerWidth && c.height !== window.innerHeight)
    {
        Bird.canv = {
            w: c.width = window.innerWidth,
            h: c.height = window.innerHeight
        };
    }
});