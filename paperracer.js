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

function createTrack() {



}

function initTrack() {

	var trackWidth = 70;
	var trackLength = 500;
	
	var start = new Object();
	start.x = 500;
	start.y = 200;

	var outerRing = new Object();

	curveStart = new Object();
	curveEnd = new Object();
	
	curveStart.x = start.x + trackLength;
	curveStart.y = start.y - trackWidth;
	curveEnd.x = curveStart.x + 2 * trackWidth;
	curveEnd.y = curveStart.y + 2 * trackWidth;
	outerRing.curve1 = createCurve(curveStart, curveEnd, false);

	curveStart.x = curveEnd.x;
	curveStart.y = curveEnd.y;
	curveEnd.x = start.x + trackLength;
	curveEnd.y = start.y - trackWidth + 4 * trackWidth;
	outerRing.curve2 = createCurve(curveStart, curveEnd, true);

	curveStart.x = start.x;
	curveStart.y = start.y + 3 * trackWidth;
	curveEnd.x = start.x - 2 * trackWidth;
	curveEnd.y = start.y + trackWidth;
	outerRing.curve3 = createCurve(curveStart, curveEnd, false);

	curveStart.x = start.x - 2 * trackWidth;
	curveStart.y = start.y + trackWidth;
	curveEnd.x = start.x;
	curveEnd.y = start.y - trackWidth;
	outerRing.curve4 = createCurve(curveStart, curveEnd, true);

	var innerRing = new Object();

	curveStart.x = start.x;
	curveStart.y = start.y;
	curveEnd.x = curveStart.x - trackWidth;
	curveEnd.y = curveStart.y + trackWidth;
	innerRing.curve1 = createCurve(curveStart, curveEnd, false);

	curveStart.x = curveEnd.x;
	curveStart.y = curveEnd.y;
	curveEnd.x = start.x;
	curveEnd.y = start.y + 2 * trackWidth;
	innerRing.curve2 = createCurve(curveStart, curveEnd, true);

	curveStart.x = start.x + trackLength;
	curveStart.y = start.y + 2 * trackWidth;
	curveEnd.x = start.x + trackLength + trackWidth;
	curveEnd.y = start.y + trackWidth;
	innerRing.curve3 = createCurve(curveStart, curveEnd, false);

	curveStart.x = start.x + trackLength + trackWidth;
	curveStart.y = start.y + trackWidth;
	curveEnd.x = start.x + trackLength;
	curveEnd.y = start.y;
	innerRing.curve4 = createCurve(curveStart, curveEnd, true);

	context.lineWidth = 10;
	context.strokeStyle = "#000000";

	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(start.x, start.y - trackWidth);

	addCurveToContext(outerRing.curve1);
	addCurveToContext(outerRing.curve2);
	addCurveToContext(outerRing.curve3);
	addCurveToContext(outerRing.curve4);

	context.lineTo(start.x, start.y);

	addCurveToContext(innerRing.curve1);
	addCurveToContext(innerRing.curve2);
	addCurveToContext(innerRing.curve3);
	addCurveToContext(innerRing.curve4);
	
	context.closePath();
	context.stroke();

	context.fillStyle = "#AAAAAA";
	context.fill();

}

function addCurveToContext(curve) {

	var A = curve.A;
	var B = curve.B;
	var K1 = curve.K1;
	var K2 = curve.K2;

	context.lineTo(A.x, A.y);
	context.bezierCurveTo(K1.x, K1.y, K2.x, K2.y, B.x, B.y);

}

function createCurve(start, end, down) {

	var curve = new Object();

	curve.A = new Object();
	curve.A.x = start.x;
	curve.A.y = start.y;

	curve.B = new Object();
	curve.B.x = end.x;
	curve.B.y = end.y;

	curve.K1 = new Object();
	if (down) {
		curve.K1.x = start.x;
		curve.K1.y = start.y + (end.y - start.y) / 2;
	} else {
		curve.K1.x = start.x + (end.x - start.x) / 2;
		curve.K1.y = start.y;
	}

	curve.K2 = new Object();
	if (down) {
		curve.K2.x = end.x - (end.x - start.x) / 2;
		curve.K2.y = end.y;
	} else {
		curve.K2.x = end.x;
		curve.K2.y = end.y - (end.y - start.y) / 2;
	}

	return curve;

}

/* Editor */

var editorUserPoints = [];

function enableEditor() {
	$("#canvas").bind('click.editorClick', editorClick);
}

function disableEditor() {
	$("#canvas").unbind('click.editorClick');
}

function editorClick(e) {
	console.log('Click event triggered!');
	var x = e.offsetX==undefined?e.pageX:e.offsetX;
	var y = e.offsetY==undefined?e.pageY:e.offsetY;
	console.log('x: ' + x + ", y: " + y);
	var pos = new Object();
	pos.x = x;
	pos.y = y;
	editorUserPoints.push(pos);
}