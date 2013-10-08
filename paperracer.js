var canvas = null;
var context = null;

function init() {
	
	console.log("Initializing ...");
	
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	window.addEventListener('resize', initBoard, false);
	
	initBoard();

	console.log("Initialization done.");

	
}

function initBoard() {

	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

	initTrack();
	initGrid();

}

function initGrid() {

	console.log("Initializing grid ...");

    context.lineWidth = 1;
    context.strokeStyle = "#888888";
    context.translate(0.5, 0.5);

	for (var i = 0; i < canvas.width; i += 10) {
		
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, canvas.height);
		context.stroke();
		
	};

	for (var i = 0; i < canvas.height; i += 10) {

		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(canvas.width, i);
		context.stroke();

	}

}

function initTrack() {

	var trackWidth = 100;
	var trackLength = 300;
	
	var start = new Object();
	start.x = 300;
	start.y = 200;

	var outerRing = new Object();
	
	outerRing.curve1 = new Object();

	outerRing.curve1.A = new Object();
	outerRing.curve1.A.x = start.x + trackLength;
	outerRing.curve1.A.y = start.y - trackWidth;

	outerRing.curve1.B = new Object();
	outerRing.curve1.B.x = outerRing.curve1.A.x + 2 * trackWidth;
	outerRing.curve1.B.y = outerRing.curve1.A.y + 2 * trackWidth;

	outerRing.curve1.K1 = new Object();
	outerRing.curve1.K1.x = outerRing.curve1.A.x + trackWidth / 2;
	outerRing.curve1.K1.y = outerRing.curve1.A.y;

	outerRing.curve1.K2 = new Object();
	outerRing.curve1.K2.x = outerRing.curve1.A.x + trackWidth;
	outerRing.curve1.K2.y = start.y - trackWidth;

	


	outerRing.curve2 = new Object();
	outerRing.curve3 = new Object();
	outerRing.curve4 = new Object();

	var innerRing = new Object();

	innerRing.curve1 = new Object();
	innerRing.curve2 = new Object();
	innerRing.curve3 = new Object();
	innerRing.curve4 = new Object();

	context.lineWidth = 10;
	context.strokeStyle = "#000000";

	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(start.x, start.y - trackWidth);
	context.lineTo(start.x + trackLength, start.y - trackWidth);
	context.bezierCurveTo(start.x + trackLength + trackWidth / 2, start.y - trackWidth, 600,200, 600,250);
	context.bezierCurveTo(600,300, 550,350, 500,350);
	context.lineTo(300,350);
	context.bezierCurveTo(250,350, 200,300, 200,250);
	context.bezierCurveTo(200,200, 250,150, 300,150);
	context.lineTo(300,200);
	context.bezierCurveTo(275,200, 250,225, 250,250);
	context.bezierCurveTo(250,275, 275,300, 300,300);
	context.lineTo(500,300);
	context.bezierCurveTo(525,300, 550,275, 550,250);
	context.bezierCurveTo(550,225, 525,200, 500,200);
	context.closePath();
	context.stroke();

	context.fillStyle = "#AAAAAA";
	context.fill();

}