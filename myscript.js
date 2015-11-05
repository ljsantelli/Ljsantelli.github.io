// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 676;
canvas.visibility = "visible";
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "background.jpg";

// Car image
var carReady = false;
var carImage = new Image();
carImage.onload = function () {
	carReady = true;
};
carImage.src = "porsche.png";

// Cone image
var coneReady = false;
var coneImage = new Image();
coneImage.onload = function () {
	coneReady = true;
};
coneImage.src = "cone.png";

// circles
var circleUp = {
	centerX: 450,
	centerY: 465,
	radius: 60
};
var circleDown = {
	centerX: 450,
	centerY: 605,
	radius: 60
};
var circleLeft = {
	centerX: 305,
	centerY: 605,
	radius: 60
};
var circleRight = {
	centerX: 595,
	centerY: 605,
	radius: 60
};


// Game objects
var car = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var cone = {
	x: 0,
	y: 0
};
var conesHit = 0;

// Handle keyboard controls
var keysDown = {};

// click tracking
var clicked = false;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var mouseX, mouseY;
addEventListener("touchstart", function (e) {
	//keysDown[e.keyCode] = true;
	mouseX = e.pageX;
	mouseY = e.pageY;
	clicked = true;
}, false);

var mouseX, mouseY;
addEventListener("touchend", function (e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
	clicked = false;
}, false);

var mouseX, mouseY;
addEventListener("mousedown", function (e) {
	//keysDown[e.keyCode] = true;
	mouseX = e.pageX;
	mouseY = e.pageY;
	clicked = true;
}, false);

var mouseX, mouseY;
addEventListener("mouseup", function (e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
	clicked = false;
}, false);

// Reset the game when the player catches runs over a cone
var reset = function () {
	car.x = canvas.width / 2;
	car.y = canvas.height / 2;

	// Throw a new cone somewhere on the screen randomly
	cone.x = 32 + (Math.random() * (canvas.width - 64));
	cone.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		car.y -= car.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		car.y += car.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		car.x -= car.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		car.x += car.speed * modifier;
	}
	

	// Are they touching?
	if (
		car.x <= (cone.x + 32)
		&& cone.x <= (car.x + 32)
		&& car.y <= (cone.y + 32)
		&& cone.y <= (car.y + 32)
	) {
		++conesHit;
		reset();
	}
	
	if (clicked){
		var distanceUpCircle = Math.sqrt( Math.pow(mouseX - circleUp.centerX, 2) + Math.pow(mouseY - circleUp.centerY, 2) );
		var distanceDownCircle = Math.sqrt( Math.pow(mouseX - circleDown.centerX, 2) + Math.pow(mouseY - circleDown.centerY, 2) );
		var distanceLeftCircle = Math.sqrt( Math.pow(mouseX - circleLeft.centerX, 2) + Math.pow(mouseY - circleLeft.centerY, 2) );
		var distanceRightCircle = Math.sqrt( Math.pow(mouseX - circleRight.centerX, 2) + Math.pow(mouseY - circleRight.centerY, 2) );

		if (distanceUpCircle < circleUp.radius){
			console.log('up in range!');
			car.y -= car.speed * modifier;
		}
		else if (distanceDownCircle < circleDown.radius){
			console.log('down in range!');
			car.y += car.speed * modifier;
		}
		else if (distanceLeftCircle < circleLeft.radius){
			console.log('left in range!');
			car.x -= car.speed * modifier;
		}
		else if (distanceRightCircle < circleRight.radius){
			console.log('right in range!');
			car.x += car.speed * modifier;
		}
		else{
			console.log('out of range!');
		}
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (carReady) {
		ctx.drawImage(carImage, car.x, car.y);
	}

	if (coneReady) {
		ctx.drawImage(coneImage, cone.x, cone.y);
	}
	
	// circles
	ctx.beginPath();
	ctx.arc(circleUp.centerX,circleUp.centerY,circleUp.radius,0,2*Math.PI);
	ctx.stroke(); //up
	ctx.font = "16px Trebuchet MS";
	ctx.fillText("UP", 442, 460);

	ctx.beginPath();
	ctx.arc(circleDown.centerX,circleDown.centerY,circleDown.radius,0,2*Math.PI);
	ctx.stroke(); //down
	ctx.stroke(); //up
	ctx.fillText("DOWN", 429, 600);

	ctx.beginPath();
	ctx.arc(circleLeft.centerX,circleLeft.centerY,circleLeft.radius,0,2*Math.PI);
	ctx.stroke(); //left
	ctx.fillText("LEFT", 288, 600);

	ctx.beginPath();
	ctx.arc(circleRight.centerX,circleRight.centerY,circleRight.radius,0,2*Math.PI);
	ctx.stroke(); //right
	ctx.fillText("RIGHT", 574, 600);

	// Score
	ctx.font = "16px Trebuchet MS";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Cones run over: " + conesHit, 373, 8);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Play
var then = Date.now();
reset();
main();
