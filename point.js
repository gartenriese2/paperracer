function Point (x,y) {
	
	this.x = x;
	this.y = y;

}

Point.prototype.log = function() {
	
	console.log("x: " + this.x + ", y: " + this.y);

};

Point.prototype.draw = function(ctx,fill) {
	
	ctx.fillStyle=fill;
	ctx.fillRect(this.x - 4, this.y - 4, 8, 8);

};