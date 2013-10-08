var canvas = null;
var context = null;

function init() {
	console.log("Initializing game...");
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.fillRect(20,20,150,100);
	console.log("Initialization done.");
}