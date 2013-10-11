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

	//initTrack();
	initGrid();

}

var gridSize = 17;

function initGrid() {

	console.log("Initializing grid ...");

    context.lineWidth = 1;
    context.strokeStyle = "#888888";
    context.translate(0.5, 0.5);

	for (var i = 0; i < canvas.width; i += gridSize) {
		
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, canvas.height);
		context.stroke();
		
	};

	for (var i = 0; i < canvas.height; i += gridSize) {

		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(canvas.width, i);
		context.stroke();

	}

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

/*
	
	EDITOR FUNCTIONS

*/

function repaint() {

	

	if (editorUserPoints.length > 1) {

		var vectors = calculateVectors();
		var sidePoints = calculateSidePoints(vectors);
		var controlPoints = calculateControlPoints(sidePoints, vectors);

		//drawPath(controlPoints);
		drawTrack(sidePoints, controlPoints);
		drawFinishLine(sidePoints);

	}

	initGrid();

}

function drawTrack(sidePoints, controlPoints) {

	context.lineWidth = 10;
	context.strokeStyle = "#000000";
	drawSmoothPath(sidePoints, controlPoints);
	context.fillStyle = "#AAAAAA";
	context.fill();

}

function drawFinishLine(sidePoints) {

	context.lineWidth = 5;
	context.strokeStyle = "#FF0000";
	var line = [];
	line.push(sidePoints[0]);
	line.push(sidePoints[sidePoints.length - 1]);
	drawPath(line);

}
 
function drawPath(path) {

	context.beginPath();

	for (var i = 0; i < path.length; i++) {
		
		if (i == 0) {
			
			context.moveTo(path[i].x, path[i].y);
		
		} else {
			
			context.lineTo(path[i].x, path[i].y)

		}

	}

	context.stroke();

}

function drawSmoothPath(path, controlPoints) {

	context.beginPath();

	for (var i = 0; i < path.length; i++) {
		
		if (i == 0) {
			
			context.moveTo(path[i].x, path[i].y);
		
		} else {

			context.bezierCurveTo(controlPoints[2 * (i - 1)].x, controlPoints[2 * (i - 1)].y,
								controlPoints[2 * (i - 1) + 1].x, controlPoints[2 * (i - 1) + 1].y,
								path[i].x, path[i].y);


		}

	}

	context.stroke();

}

function calculateVectors() {

	var sideVectors = [];

	for (var i = 0; i < editorUserPoints.length; i++) {
		
		if (i == 0) {

			var vec = new Object();
			vec.x = 1;
			vec.y = 0;
			sideVectors.push(vec);

		} else if (i == editorUserPoints.length - 1) {

			var vec = new Object();
			
			if (trackFinished) {
				vec.x = editorUserPoints[0].x - editorUserPoints[i - 1].x;
				vec.y = editorUserPoints[0].y - editorUserPoints[i - 1].y;
			} else {
				vec.x = editorUserPoints[i].x - editorUserPoints[i - 1].x;
				vec.y = editorUserPoints[i].y - editorUserPoints[i - 1].y;
			}
			
			var len = Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2));
			vec.x /= len;
			vec.y /= len;
			sideVectors.push(vec);

		} else {

			var vec = new Object();
			vec.x = editorUserPoints[i + 1].x - editorUserPoints[i - 1].x;
			vec.y = editorUserPoints[i + 1].y - editorUserPoints[i - 1].y;
			var len = Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2));
			vec.x /= len;
			vec.y /= len;
			sideVectors.push(vec);

		}

	}

	return sideVectors;

}

function calculateIntersection(A,vA,B,vB) {

	var intersection = new Object();
	var beta = 0;

	if ((vA.x == 0 && vB.x == 0) || (vA.y == 0 && vB.y == 0)) {
		intersection.x = (A.x + B.x) / 2;
		intersection.y = (A.y + B.y) / 2;
		return intersection;
	} else if (vA.x == 0) {
		beta = (A.x - B.x) / vB.x;
	} else if (vA.y == 0) {
		beta = (A.y - B.y) / vB.y;
	} else if (vB.x == 0 || vB.y == 0) {
		if (vB.x == 0) {
			beta = (B.x - A.x) / vA.x;
		} else {
			beta = (B.y - A.y) / vA.y;
		}
		intersection.x = A.x + beta * vA.x;
		intersection.y = A.y + beta * vA.y;
		return intersection;
	} else {
		beta = (A.y - B.y + (B.x - A.x) * vA.y / vA.x) / (vB.y - vA.y * vB.x / vA.x);
	}
	
	intersection.x = B.x + beta * vB.x;
	intersection.y = B.y + beta * vB.y;

	return intersection;

}

function calculateControlPoints(path, vectors) {

	var controlPoints = [];

	for (var i = 0; i < path.length / 2 - 1; i++) {
		
		var A = path[i];
		var B = path[i + 1];
		var vA = vectors[i];
		if (i == path.length / 2 - 2) {
			var vB = vectors[0];
		} else {
			var vB = vectors[i + 1];
		}

		var S = calculateIntersection(A, vA, B, vB);

		var xDelta = (S.x - A.x) / 2;
		var yDelta = (S.y - A.y) / 2;
		var len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K1 = new Object();
		K1.x = A.x + len * vA.x;
		K1.y = A.y + len * vA.y;

		controlPoints.push(K1);

		xDelta = (B.x - S.x) / 2;
		yDelta = (B.y - S.y) / 2;
		len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K2 = new Object();
		K2.x = B.x - len * vB.x;
		K2.y = B.y - len * vB.y;

		controlPoints.push(K2);

	};


	var p1 = new Object();
	var p2 = new Object();

	if (trackFinished) {
		
		p1.x = path[0].x;
		p1.y = path[0].y + 1;
		controlPoints.push(p1);
		
		p2.x = p1.x;
		p2.y = path[0].y + 2;
		controlPoints.push(p2);

	} else {

		p1.x = path[path.length / 2 - 1].x - vectors[vectors.length - 1].y;
		p1.y = path[path.length / 2 - 1].y + vectors[vectors.length - 1].x;
		controlPoints.push(p1);
		
		p2.x = path[path.length / 2].x + vectors[vectors.length - 1].y;
		p2.y = path[path.length / 2].y - vectors[vectors.length - 1].x;
		controlPoints.push(p2);

	}
	

	var vecCount = vectors.length - 1;
	for (var i = path.length / 2; i < path.length - 1; i++) {

		var A = path[i];
		var B = path[i + 1];
		var vA = new Object();
		var vB = new Object();
		if (i == path.length / 2 && trackFinished) {
			vA.x = -vectors[0].x;
			vA.y = -vectors[0].y;
			vB.x = -vectors[vecCount].x;
			vB.y = -vectors[vecCount].y;
		} else {
			vA.x = -vectors[vecCount].x;
			vA.y = -vectors[vecCount].y;
			vB.x = -vectors[vecCount - 1].x;
			vB.y = -vectors[vecCount - 1].y;
			vecCount--;
		}
		

		var S = calculateIntersection(A, vA, B, vB);

		var xDelta = (S.x - A.x) / 2;
		var yDelta = (S.y - A.y) / 2;
		var len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K1 = new Object();
		K1.x = A.x + len * vA.x;
		K1.y = A.y + len * vA.y;

		controlPoints.push(K1);

		xDelta = (B.x - S.x) / 2;
		yDelta = (B.y - S.y) / 2;
		len = Math.sqrt(Math.pow(xDelta,2) + Math.pow(yDelta,2));

		var K2 = new Object();
		K2.x = B.x - len * vB.x;
		K2.y = B.y - len * vB.y;

		controlPoints.push(K2);

	}

	return controlPoints;

}

function calculateSidePoints(vectors) {

	var sidePoints = [];

	for (var i = 0; i < editorUserPoints.length; i++) {
		
		var point = new Object();

		point.x = editorUserPoints[i].x + editorUserPoints[i].width * vectors[i].y;
		point.y = editorUserPoints[i].y + editorUserPoints[i].width * -vectors[i].x;

		sidePoints.push(point);

	}

	if (trackFinished) {
		var point1 = new Object();
		var point2 = new Object();
		point1.x = editorUserPoints[0].x;
		point1.y = editorUserPoints[0].y - editorUserPoints[0].width;
		sidePoints.push(point1);
		point2.x = point1.x;
		point2.y = editorUserPoints[0].y + editorUserPoints[0].width;
		sidePoints.push(point2);
	}

	for (var i = editorUserPoints.length - 1; i >= 0; i--) {
		
		var point = new Object();

		point.x = editorUserPoints[i].x - editorUserPoints[i].width * vectors[i].y;
		point.y = editorUserPoints[i].y - editorUserPoints[i].width * -vectors[i].x;

		sidePoints.push(point);

	}

	return sidePoints;

}

function snapToGrid(point) {

	point.x = gridSize * Math.round(point.x / gridSize);
	point.y = gridSize * Math.round(point.y / gridSize);

}

function refresh() {
	canvas.width = canvas.width; // Reset whole canvas
	initBoard();
}

/* Testing */

function testTrack() {

	if (trackFinished) {

		// Disable click event
		$("#canvas").unbind('click.editorClick');

		// Disable mouse wheel event
		$("#canvas").unbind('mousewheel');

		$("#controls .controls_editor").hide();
		$("#controls .controls_testTrack").fadeIn();

	}

}

function endTestTrack() {

	// Enable click event
	$("#canvas").bind('click.editorClick', editorClick);

	// Enable mousewheel event
	$("#canvas").bind('mousewheel', editorMouseWheel);

	$("#controls .controls_testTrack").hide();
	$("#controls .controls_editor").fadeIn();

}

/* Editor */


var editorUserPoints = [];
var editorMinRoadWidth = 25;
var editorStdRoadWidth = 50;
var editorMaxRoadWidth = 150;
var editorCurrentRoadWidth = editorStdRoadWidth;

var trackFinished = false;

function unDo() {

	if (trackFinished) {

		trackFinished = false;
		refresh();
		repaint();

	} else if (editorUserPoints.length >= 1) {

		editorUserPoints.splice(editorUserPoints.length - 1, 1);
		refresh();
		repaint();

	}

}

function finishTrack() {
	
	if (editorUserPoints.length > 3) {
		trackFinished = true;
		refresh();
		repaint();
	}
	
}

function enableEditor() {
	// Display / hide buttons
	$("#controls .start").hide();
	$("#controls .editor").hide();
	$("#controls .controls_editor").fadeIn();

	// Enable click event
	$("#canvas").bind('click.editorClick', editorClick);

	// Enable mousewheel event
	$("#canvas").bind('mousewheel', editorMouseWheel);
}

function disableEditor() {
	
	// Disable click event
	$("#canvas").unbind('click.editorClick');
	// Disable mouse wheel event
	$("#canvas").unbind('mousewheel');
	// Hide buttons
	$("#controls .controls_editor").hide();
	$("#controls .start").show();
	$("#controls .editor").show();
	
	clearEditor();

}

function clearEditor() {
	editorUserPoints = [];
	trackFinished = false;
	refresh();
	repaint();
}

/**
 * Event which is triggered on a click
 * @param  {Event} e The click event
 */
function editorClick(e) {
	console.log('Click event triggered!');

	// Get coordinates
	var x = e.offsetX==undefined?e.pageX:e.offsetX;
	var y = e.offsetY==undefined?e.pageY:e.offsetY;

	// Reset width
	//editorCurrentRoadWidth = editorStdRoadWidth;

	var point = new Object();
	point.x = x;
	point.y = y;
	snapToGrid(point);
	point.width = editorCurrentRoadWidth;
	editorUserPoints.push(point);

	// Refresh the canvas
	refresh();

	// Render canvas
	repaint();

}

/**
 * Callback function that is called when the mouswheel is
 * used
 * @param Event e The browser event
 * @param int delta Movement of the wheel
 */
function editorMouseWheel(e, delta) {
	// Change width of the last point
	var index = editorUserPoints.length-1;
	if(index > 0) {
		editorUserPoints[index].width += delta;
		editorCurrentRoadWidth = editorUserPoints[index].width;
		if(editorUserPoints[index].width > editorMaxRoadWidth) {
			editorUserPoints[index].width = editorMaxRoadWidth;
		} else if(editorUserPoints[index].width < editorMinRoadWidth) {
			editorUserPoints[index].width = editorMinRoadWidth;
		}
		console.log("New road width: " + editorUserPoints[index].width);
	}
	refresh();
	repaint();
}

function editorSave() {
	var jsonString = JSON.stringify(editorUserPoints);
	alert(jsonString);
}