function Editor() {

	this.track = new Track();

}

Editor.prototype.enable = function() {

	// Display / hide buttons
	$("#controls .start").hide();
	$("#controls .editor").hide();
	$("#controls .controls_editor").fadeIn();

	// Enable click event
	$("#canvas").on('click.editorClick', { editor: this }, this.click);

	// Enable mousewheel event
	$("#canvas").on('mousewheel', { editor: this }, this.mouseWheel);

}

Editor.prototype.disable = function() {
	
	// Disable click event
	$("#canvas").off('click.editorClick');

	// Disable mouse wheel event
	$("#canvas").off('mousewheel');
	
	// Hide buttons
	$("#controls .controls_editor").hide();
	$("#controls .start").show();
	$("#controls .editor").show();
	
	this.clear();

}

Editor.prototype.refresh = function() {
	
	canvas.width = canvas.width; // Reset whole canvas
	initBoard();

}

Editor.prototype.clear = function() {
	
	this.track = new Track();
	this.refresh();
	this.repaint();

}

Editor.prototype.repaint = function() {

	this.track.refresh();
	this.track.draw();

	initGrid();

}

Editor.prototype.finishTrack = function() {
	
	if (this.track.getMidpoints().length > 3) {
		
		this.track.finish();
		this.refresh();
		this.repaint();

	}

}

Editor.prototype.undo = function() {
	
	if (this.track.isFinished()) {

		this.track.unfinish();

	} else {

		this.track.deleteLastPoint();

	}

	this.refresh();
	this.repaint();

}

/**
 * Event which is triggered on a click
 * @param  {Event} e The click event
 */
Editor.prototype.click = function(e) {
	
	//console.log('Click event triggered!');

	// Get coordinates
	var x = e.offsetX==undefined?e.pageX:e.offsetX;
	var y = e.offsetY==undefined?e.pageY:e.offsetY;

	var point = new Point(x,y);
	point.snapToGrid();
	point.width = editorCurrentRoadWidth;
	
	e.data.editor.track.addPoint(point);

	// Refresh the canvas
	e.data.editor.refresh();

	// Render canvas
	e.data.editor.repaint();

}

/**
 * Callback function that is called when the mouswheel is
 * used
 * @param Event e The browser event
 * @param int delta Movement of the wheel
 */
Editor.prototype.mouseWheel = function(e, delta) {
	
	// Change width of the last point

	var index = e.data.editor.track.getMidpoints().length-1;
	
	if(index > 0) {

		var lastPoint = e.data.editor.track.getMidpoints()[index];
		
		lastPoint.width += delta;
		
		if(lastPoint.width > editorMaxRoadWidth) {
			lastPoint.width = editorMaxRoadWidth;
		} else if(lastPoint.width < editorMinRoadWidth) {
			lastPoint.width = editorMinRoadWidth;
		}

		editorCurrentRoadWidth = lastPoint.width;

		console.log("New road width: " + lastPoint.width);

	}

	e.data.editor.refresh();
	e.data.editor.repaint();

}