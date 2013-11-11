function Game(track, numPlayers) {

	this.startingPos = this.calculateStartingPositions(track.getFinishLine());
	this.players = this.createPlayers(numPlayers);
	this.enable();
	this.started = false;
	this.move = 0;
	alert("Set your starting position(s).");

}

Game.prototype.enable = function() {

	// Enable click event
	$("#canvas").on('click.gameClick', { game: this }, this.click);

}

/**
 * Event which is triggered on a click
 * @param  {Event} e The click event
 */
Game.prototype.click = function(e) {

	// Get coordinates
	var x = e.offsetX==undefined?e.pageX:e.offsetX;
	var y = e.offsetY==undefined?e.pageY:e.offsetY;

	var point = new Point(x,y);

	// Player setting
	if (!e.data.game.started) {

		var dist = 9999; // todo: better value

		for (var i = 0; i < e.data.game.startingPos.length; ++i) {

			var d = point.getDistance(e.data.game.startingPos[i]);
			
			if (d < dist) {
				dist = d;
				var occ = false;
				for (var j = 0; j < e.data.game.move; ++j) {
					if (e.data.game.players[j].getPixelPosition.getDistance(e.data.game.startingPos[i]) < 0.1) { // todo: better comparison value
						occ == true;
					}
				}
				if (!occ) e.data.game.players[e.data.game.move].setPixelPosition(e.data.game.startingPos[i]);
			}

		}

		e.data.game.players[e.data.game.move].move(0,0);

	}
	// Player moving
	else {

		var dist = 9999; // todo: better value
		var count = e.data.game.move % e.data.game.players.length;
		var player = e.data.game.players[count];
		var fut = player.getFutures();
		var futPix = player.getPixelFutures();
		var oldPos = player.getPosition();
		var s = new Point(oldPos);

		for (var i = 0; i < fut.length; ++i) {

			var d = point.getDistance(futPix[i]);
			
			if (d < dist) {
				dist = d;
				var occ = false;
				for (var j = 0; j < e.data.game.players.length; ++j) {
					if (e.data.game.players[j].getPosition().getDistance(fut[i]) < 0.1) { // todo: better comparison value
						occ == true;
					}
				}
				if (!occ) {

					s = new Point(fut[i]);
					
				}
			}

		}

		s.subPoint(oldPos);
		//s.log();
		e.data.game.players[count].move(s.x, s.y);

	}
	e.data.game.move++;
	if (e.data.game.started == false && e.data.game.move >= e.data.game.players.length) e.data.game.started = true;
	console.log("Move: " + (e.data.game.move - 1));

	// Refresh the canvas
	editor.refresh();

	// Render canvas
	editor.repaint();

	e.data.game.drawPlayers();
	e.data.game.drawFuture(e.data.game.move % e.data.game.players.length);

}

Game.prototype.drawPlayers = function() {
	
	for (var i = 0; i < this.players.length; ++i) {

		this.players[i].draw(context, "#00ff00");

	}

}

Game.prototype.drawFuture = function(i) {

	this.players[i].drawFutures();
	
}

Game.prototype.calculateStartingPositions = function(finishLine) {
	
	var startingPos = [];

	var lower = new Point();
	lower.addPoint(finishLine[1]);
	lower.snapToGrid();
	if (lower.y > finishLine[1].y) {
		lower.y -= gridSize;
	}

	var upper = new Point();
	upper.addPoint(finishLine[0]);
	upper.snapToGrid();
	if (upper.y < finishLine[0].y) {
		upper.y += gridSize;
	}

	for (var i = lower.y; i >= upper.y; i -= gridSize) {

		var pnt = new Point();
		pnt.add(lower.x, i);
		startingPos.push(pnt);
		//pnt.draw(context, "#000000");

	}

	return startingPos;

}

Game.prototype.createPlayers = function(num) {
	
	var players = [];
	for (var i = 0; i < num; ++i) {
		var p = new Player(0, 0);
		players.push(p);
	}
	
	return players;

}