var canvas = null;
var context = null;

function init() {
	
	console.log("Initializing ...");
	
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	window.addEventListener('resize', initGrid, false);
	initGrid();

	console.log("Initialization done.");

	
}

function initGrid() {

	console.log("Initializing grid ...");
	
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

	for (var i = 0; i < canvas.width; i += 10) {
		
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, 400);
		context.stroke();
		
	};

	for (var i = 0; i < canvas.height; i += 10) {

		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(400, i);
		context.stroke();

	}

}