function Player(x, y) {

	this.position = new Point();
	this.position.add(x, y);
	this.speed = new Point();
	this.futures = [];

}

Player.prototype.move = function(x, y) {
	
	this.position.add(x, y);
	this.futures = this.calculateFuturePositions();

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

Player.prototype.calculateFuturePositions = function() {
	
	var pts = [];

	if (this.speed.x == 0 && this.speed.y == 0) {

		var p1 = new Point(this.position.x + 1, this.position.y - 1);
		var p2 = new Point(this.position.x + 1, this.position.y);
		var p3 = new Point(this.position.x + 1, this.position.y + 1);
		pts.push(p1);
		pts.push(p2);
		pts.push(p3);

	}

	return pts;

}

Player.prototype.draw = function(ctx, col) {
	
	ctx.fillStyle = col;
	var pixPos = this.getPixelPosition();
	ctx.fillRect(pixPos.x - 6, pixPos.y - 3, 12, 6);

}

Player.prototype.drawFutures = function() {
	
	for (var i = 0; i < this.futures.length; ++i) {

		var pixFut = this.futures[i].mul(gridSize);

		pixFut.draw(context, "#ff0000");

	}

}