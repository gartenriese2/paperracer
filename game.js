function Game(track, numPlayers) {

	calculateStartingPositions(track.getFinishLine());

}

Game.prototype.calculateStartingPositions = function(finishLine) {
	
	var lower = new Point();
	lower.addPoint(finishLine[1]);
	lower.snapToGrid();
	if (lower.y > finishLine[1].y) {
		lower.y += gridSize;
	}

};