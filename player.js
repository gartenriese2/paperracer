function Player(x, y) {

	this.position = new Point();
	this.position.add(x, y);
	this.speed = new Point();

}

Player.prototype.move = function(x, y) {
	
	this.position.add(x, y);

}

Player.prototype.getPosition = function() {

	return this.position;

}

Player.prototype.setPosition = function(pnt) {
	
	this.position = pnt;

}

Player.prototype.getPixelPosition = function() {
	
	var pos = new Point();
	pos.addPoint(this.position.mul(gridSize));
	return pos;

}

Player.prototype.setPixelPosition = function(pnt) {
	
	pnt.snapToGrid();
	this.position = pnt.div(gridSize);

}

Player.prototype.draw = function(ctx, col) {
	
	ctx.fillStyle = col;
	ctx.fillRect(this.x - 6, this.y - 3, 12, 6);

}